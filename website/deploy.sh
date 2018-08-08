#!/bin/bash
cd ${0%/*}
yarn
yarn build
scp -i deploy.pem -o StrictHostKeyChecking=no -r build cdiesh@jbrowse.org:~/
