#!/bin/bash
cd ${0%/*}
yarn
yarn build
ls ../
scp -i ../deploy.pem -o StrictHostKeyChecking=no -r build cdiesh@jbrowse.org:~/
