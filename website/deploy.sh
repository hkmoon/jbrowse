#!/bin/bash
cd ${0%/*}
echo `pwd`
ls
yarn
yarn build
scp -i deploy.pem -o StrictHostKeyChecking=no -r build cdiesh@jbrowse.org:~/
