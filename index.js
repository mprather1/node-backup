#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Shlogger = require('shlogger')
var { Client } = require('ssh2')
const config = require('./config.json')

const SOURCE = config.SOURCE
const OUTPUT = config.OUTPUT
const HOST = config.HOST
const USERNAME = config.USERNAME
const RSA = config.RSA

const logger = new Shlogger({
  directory: process.env['LOG_DIR']
})

var conn = new Client()

conn.connect({
  host: HOST,
  port: 22,
  username: USERNAME,
  privateKey: require('fs').readFileSync(RSA)
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
