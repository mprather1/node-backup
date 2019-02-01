# mprather1/node-backup

## Table of Contents
1. [ Synopsis ](#synopsis)
2. [ Usage ](#usage) <br />
3. [ TODO ](#todo)

<a name="synopsis"></a>
### Synopsis

Copy a directory on a remote machine to a local directory via sftp.
  
### Installation

    yarn install

<a name="usage"></a>
### Usage

    ./index [options]

    Options:
      -l, --log <dir>        location of log directory [optional]
      -s, --remote <dir>     location of remote source directory
      -o, --output <dir>     location of output directory
      -u, --username <name>  remote login username
      -k, --key <dir>        location of private key
      -r --host <ip>         IP of remote host
      -h, --help             output usage information


<a name="todo"></a>
### TODO