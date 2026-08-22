#!/bin/bash
set -euo pipefail
install -m 644 /home/meow/Desktop/madina+/deploy/systemd/cloudflared-quick.service /etc/systemd/system/cloudflared-quick.service
systemctl daemon-reload
systemctl enable --now cloudflared-quick.service
systemctl is-enabled cloudflared-quick
systemctl is-active cloudflared-quick
