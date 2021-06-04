# WebDAV Drive

[![build status][buildimg]][buildurl]

WebDAV front-end that adds a Google-Drive-like experience to an existing WebDAV share, built with [Svelte](https://svelte.dev) and [perry-mitchell/webdav-client/](https://github.com/perry-mitchell/webdav-client).

![screenshot](./docs/screenshot.png)


## Build

1. Install the dependencies:

    ```bash
    npm install
    ```

2. Copy the sample config file into `config.ts` then edit it:

    ```bash
    cp config.sample.ts config.ts
    ```

### Production instructions

To create an optimised version of the app:

```bash
npm run build
```

The `public` directory now contains the fully built production app.

### Development instructions

Start the dev server using the following comand, then navigate to [localhost:5000](http://localhost:5000):

```bash
npm run dev
```

[buildimg]: https://github.com/club-1/webdav-drive/actions/workflows/build.yml/badge.svg
[buildurl]: https://github.com/club-1/webdav-drive/actions/workflows/build.yml?query=branch%3Amain
