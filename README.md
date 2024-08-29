# run-await-run

Run command, await response, run command

Inspired by [start-server-and-test](https://github.com/bahmutov/start-server-and-test), just tiny compared!

[![install size](https://packagephobia.com/badge?p=run-await-run)](https://packagephobia.com/result?p=run-await-run)

## Install

```sh
npm i -D run-await-run
```

## Usage

Command to run NPM scripts in parallell, but second script waits for a response to begin. Usefull when first command starts up a server and second one should start afterwards.

```sh
run-await-run <run-first> <url> <run-second>
```

### Example

```json
{
  "scripts": {
    "server": "node ./server.js",
    "test": "run-await-run server :8080 'playwright test'"
  }
}
```

### Options

`position 1` (required): script one will run first  
`position 2` (required): URL waiting to respond  
`position 3` (required): script two will run when url responds  
`--get` (optional): fetches the URL with a GET request. Default is a HEAD request  
`--timeout <number>` (optional): when to stop waiting in milliseconds. Default is 300000 milliseconds (5 minutes)  
`--interval <number>` (optional): how often to check if URL responds in milliseconds. Default is 100 milliseconds  
`--keep-running` (optional): by default the proccess will exit when script two is completed. This will keep script one alive  

### Handy features

#### auto add npm run

If position 1 or 3 matches a script in package.json, it will automaticly add `npm run`. Meaning you can write e.g. `server` instead of `'npm run server'`.

#### auto group arguments

Normally arguments must be wrapped by `"`, but groups argument by `'`. Meaning you can write `'npm run server'` instead of `\"npm run server\"`.

#### auto add localhost

If position 2 is just `:<port>`, it will add `http://localhost:<port>/`. Meaning you can write `:8080` instead of `http://localhost:8080/`