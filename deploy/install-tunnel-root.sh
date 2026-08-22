#!/bin/bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

set +e
apt-get update --allow-insecure-repositories
update_rc=$?
set -e
if [[ "$update_rc" -ne 0 ]]; then
  echo "apt update failed; retrying without Cursor apt repo"
  for f in /etc/apt/sources.list.d/*cursor*.list; do
    [[ -f "$f" ]] || continue
    mv "$f" "${f}.madinahplus.bak"
  done
  apt-get update
fi
apt-get install -y nginx curl ca-certificates

if dpkg -s cloudflared >/dev/null 2>&1; then
  echo "cloudflared already installed"
else
  dpkg -i /tmp/madinahplus-debs/cloudflared-linux-amd64.deb || apt-get install -f -y
fi

install -d /etc/nginx/sites-available /etc/nginx/sites-enabled
cp /home/meow/Desktop/madina+/deploy/nginx/madinahplus.conf /etc/nginx/sites-available/madinahplus
ln -sfn /etc/nginx/sites-available/madinahplus /etc/nginx/sites-enabled/madinahplus
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl enable nginx
systemctl restart nginx

install -d /etc/cloudflared
# Named-tunnel config is filled after `cloudflared tunnel login` + create.
# Keep a copy of the template in place if credentials already exist.
if [[ -f /home/meow/Desktop/madina+/deploy/cloudflared/config.yml ]]; then
  cp /home/meow/Desktop/madina+/deploy/cloudflared/config.yml /etc/cloudflared/config.yml.template
fi

echo "ROOT_INSTALL_OK"
nginx -v
cloudflared --version
systemctl is-enabled nginx
systemctl is-active nginx

for f in /etc/apt/sources.list.d/*.madinahplus.bak; do
  [[ -f "$f" ]] || continue
  mv "$f" "${f%.madinahplus.bak}"
done
