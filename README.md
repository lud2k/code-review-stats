[![react version](https://img.shields.io/badge/React-16.2.0-green.svg?style=flat-square)](https://github.com/facebook/react/)
[![typescript version](https://img.shields.io/badge/TypeScript-2.4.1-green.svg?style=flat-square)](https://www.typescriptlang.org/)
[![materialui version](https://img.shields.io/badge/MaterialUI-1.0.0--beta.26-green.svg?style=flat-square)](https://material-ui-next.com/)

Code Review Stats is a command line tool that generates statistics from Gerrit data.
(tho it could be extended to work with anything else).

Try it out: https://lud2k.github.io/code-review-stats/build/index.html

## QuickStart

Install it globally using NPM
```bash
npm install -g code-review-stats
```

Now it's ready to be used! To generate stats from Gerrit to the following:
```bash
code-review-stats gerrit https://my.gerrit.com
```

Enter you login and password and it will generate an HTML file containing the
stats.

## Gerrit Code Review Stats

This connects to Gerrit to generate the stats. It uses the Gerrit APIs to get
the data.

```bash
code-review-stats gerrit {host}
    -u --username {username}
    -p --password {password}
    -d --days {days}
    -l --users {user1},{user2},{user3}
    -t --title {title}
    -j --js
```

Parameters:
- `host`: the url to your Gerrit server (http://my.gerrit-server.com)
- `--username`: the username you use to login on Gerrit
- `--password`: the password you use to login on Gerrit
- `--days`: The number of days to use for the stats. It will fetch all commits
created or modified `x` days ago.
- `--users`: A comma delimited list of users to use as default filter (this can
be changed in the UI)
- `--title`: What you want the title of the page to be.
- `--js`: if set, saves as .js instead of .html for development purpose. You will want
to rename the file to data.js and put it in the build directory.

## Random Code Review Stats

This is mostly useful for development and generating sample data.

```bash
code-review-stats random
    -d --days {days}
    -t --title {title}
    -j --js
```

Parameters:
- `--days`: The number of days to generate random stats for.
- `--title`: What you want the title of the page to be.
- `--js`: if set, saves as .js instead of .html for development purpose. You will want
to rename the file to data.js and put it in the build directory.

## Development

## Working on the CLI

Use `npm run watch` to work on the CLI. It will rebuild the frontend and backend
as files are modified. You can run the command with `node build/main.js {...options}`

## Working on the UI

Use `npm run dev` to work on the UI. It will start webpack-dev-server
that will serve files in `build`. You will need to create a file `data.js`
for this to work. This file can be created by using the `--js` option
when generating stats, naming the file `data.js` and putting it in the `build`
directory.

## Building

- `npm run build` builds everything
- `npm run lint` runs the linter

## License

This project is licensed under the terms of the [MIT license](https://github.com/lud2k/code-review-stats/blob/master/LICENSE).
