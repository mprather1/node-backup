#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const program = require("commander")
const Shlogger = require('shlogger')
var { Client } = require('ssh2')
require('dotenv').config()

program
  .option('-l, --log <dir>', 'location of log directory [optional]')
  .option('-s, --remote <dir>', 'location of remote source directory')
  .option('-o, --output <dir>', 'location of output directory')
  .option('-u, --username <name>', 'remote login username')
  .option('-k, --key <dir>', 'location of private key')
  .option('-r --host <ip>', 'IP address of remote host')
  .parse(process.argv)

const LOG = path.resolve(program.log || process.env['LOG'])
const SOURCE = program.remote || process.env['SOURCE']
const OUTPUT = program.output || process.env["OUTPUT"]
const HOST = program.host || process.env['HOST']
const USERNAME = program.username || process.env['USERNAME']
const KEY = program.key || process.env['KEY']

if (!SOURCE) { throw new Error('Remote directory is required...') }
if (!OUTPUT) { throw new Error('Output directory is required...') }
if (!USERNAME) { throw new Error('Login username is required...') }
if (!KEY) { throw new Error('Location of private key is required...') }
if (!HOST) { throw new Error('Remote Host is required...') }

const logger = new Shlogger({ directory: LOG })

var conn = new Client()

conn.connect({
  host: HOST,
  port: 22,
  username: USERNAME,
  privateKey: require('fs').readFileSync(KEY)
})

conn.on('ready', function () {
  conn.exec(`tar -zcvf - ${SOURCE}/*`, function (err, stream) {
    if (err) { return logger.error(err) }
    const filename = `${new Date().toISOString()}-backup.tar.gz`
    const output = fs.createWriteStream(path.join(OUTPUT, filename))

    stream.pipe(output)

    stream.on('close', function (code, signal) {
      logger.info(`${filename} - written to ${OUTPUT}...`)
      conn.end()
    })

    stream.stderr.resume()
  })
})
