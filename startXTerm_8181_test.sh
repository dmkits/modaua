#!/bin/bash
cd "$(dirname "$(readlink -fn "$0")")"
xterm -e node server/server.js development-bata -p:8181 -log:console