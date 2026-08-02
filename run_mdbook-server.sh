#!/bin/bash

set -e

cd docs-gen
npm run build:ts
mdbook serve --open
