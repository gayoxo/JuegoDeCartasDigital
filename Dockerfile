FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --chown=1001:1001 dist/ /srv/

USER 1001:1001
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=3s --retries=3 \
  CMD wget --quiet --output-document=/dev/null http://127.0.0.1:8080/index.html || exit 1

