# WebDAV Drive

WebDAV front-end that adds a Google-Drive-like experience to an existing WebDAV share, built with [Svelte](https://svelte.dev) and [perry-mitchell/webdav-client/](https://github.com/perry-mitchell/webdav-client).

![screenshot](./docs/screenshot.png)


## Build

1. Install the dependencies:

    ```bash
    npm install
    ```

2. Copy the sample config file into `config.json` then edit it:

    ```bash
    cp config.sample.json config.json
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

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.
