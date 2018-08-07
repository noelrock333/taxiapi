#!/bin/bash
set -e

### Configuration ###

APP_DIR=/application
GIT_URL=git@github.com:noelrock333/taxiapi.git

### Automation steps ###

set -x

# Pull latest code
if [[ -e $APP_DIR/taxiapi ]]; then
  cd $APP_DIR/taxiapi
  git pull
else
  cd $APP_DIR
  git clone $GIT_URL
  cd taxiapi
fi

# Install dependencies
npm install --production
npm prune --production
