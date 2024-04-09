It uses GitHub pre-releases for non-production Capgo updates.

A container image is available at `ghcr.io/marcus-sa/capgo-github-releases-server`.

Default port is `8080`

Required environment variables
- `CAPGO_GITHUB_AUTH_TOKEN`
- `CAPGO_GITHUB_OWNER`
- `CAPGO_GITHUB_REPO`