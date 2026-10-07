#!/bin/sh
set -e
npm run format:check
npm run lint
npm test
