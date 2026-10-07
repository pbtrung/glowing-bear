#!/bin/sh
set -e
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
