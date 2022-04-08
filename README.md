This service creates HTTP server to execute a shell script placed near to it in `scripts` folder.  
No need to install any dependencies (except NodeJS itself).

Use the following command to start the server:

```shell
node run_sh_server.js
```

Run the default script via HTTP (scripts/default.sh):

```shell
curl http://localhost:3000
```

Or specify a required script name in url:

```shell
curl http://localhost:3000/hello.sh
```

Tips:

* [Installing NodeJS via package manager](https://gist.github.com/letanure/28c8bba1e44d462c1d94#file-installing-node-js-via-package-manager-md)