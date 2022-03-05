# WebDAV Drive

[![build status][buildimg]][buildurl]

WebDAV front-end that adds a Google-Drive-like experience to an existing WebDAV
share, written in [TypeScript][typescript] with [Svelte][svelte],
[Carbon][carbon] and [perry-mitchell/webdav-client][webdav].

![screenshot](./docs/screenshot.png)

It can be configured at runtime, not [suckless][suckless] style, with a
`config.json` file in `public/app`.

## Build...

1. Install the dependencies:

    ```bash
    make node_modules
    ```

2. Copy the sample config file into `config.ts` then edit it:

    ```bash
    make config.json
    ```

### ...for production

To create an optimised version of the app:

```bash
make
```

The `public` directory now contains the fully built production app.

### ...for development

Start the dev server using the following comand, then navigate to
[localhost:8080](http://localhost:8080):

```bash
make dev
```

[buildimg]: https://github.com/club-1/webdav-drive/actions/workflows/build.yml/badge.svg
[buildurl]: https://github.com/club-1/webdav-drive/actions/workflows/build.yml?query=branch%3Amain
[typescript]: https://github.com/microsoft/TypeScript
[svelte]: https://svelte.dev
[carbon]: https://github.com/carbon-design-system/carbon-components-svelte
[webdav]: https://github.com/perry-mitchell/webdav-client
[suckless]: https://suckless.org/
