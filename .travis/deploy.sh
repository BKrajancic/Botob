#!/bin/bash
eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 id_rsa # Allow read access to the private key
ssh-add id_rsa # Add the private key to SSH

echo -e "Host $IP\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
git config --global push.default matching
git remote add deploy ssh://root@$IP$DEPLOY_DIR
git push deploy master
echo "Completed!"

ssh root@$IP <<EOF
  cd $DEPLOY_DIR
  pkill node
  tsc -p tsconfig.json
  tsc -p tsconfig.json
  cd bin
  node main.js
  exit
EOF

exit