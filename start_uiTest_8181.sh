#!/bin/bash
cd "$(dirname "$(readlink -fn "$0")")"

node server/server.js -p:8181 uiTest -log:console & nightwatch

kill $(lsof -t -i:8181)
