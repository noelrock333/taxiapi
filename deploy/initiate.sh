#!/bin/bash
set -e

### Configuration ###

SERVER=root@206.189.175.72
REMOTE_SCRIPT_PATH=/tmp/deploy/work.sh

### Library ###

function run()
{
  echo "Running: $@"
  "$@"
}

### Automation steps ###
echo "---- Running deployment script on remote server ----"
run ssh $SERVER bash $REMOTE_SCRIPT_PATH
