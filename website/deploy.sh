#!/bin/bash
set -o verbose
set -x
set -v
yarn
yarn build
scp -i deploy.pem -o StrictHostKeyChecking=no -r build cdiesh@jbrowse.org:~/
