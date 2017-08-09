#!/bin/bash
cd "$(dirname "$(readlink -fn "$0")")"
node server/server.js -p:8181 test -log:console
