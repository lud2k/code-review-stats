#!/usr/bin/env node
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander = __webpack_require__(2);
const inquirer = __webpack_require__(3);
const ProgressBar = __webpack_require__(4);
const template_1 = __webpack_require__(5);
const random_1 = __webpack_require__(7);
const gerrit_1 = __webpack_require__(9);
const saveData = (data, options, config) => {
    const filename = Date.now();
    if (!options.js) {
        template_1.createHtmlPage(`${filename}.html`, config, data);
        console.info(`Code Review Stats saved in ${filename}.html`);
    }
    else {
        template_1.createJsScript(`${filename}.js`, config, data);
        console.info(`Code Review Stats saved in ${filename}.js`);
    }
};
commander.version('1.0.0');
commander.command('gerrit <host>')
    .description('Create code review stats fetching data from Gerrit')
    .option('-d --days <days>', 'Limit age of commits to use in stats')
    .option('-l --users <users>', 'Comma delimited list of users to use as default filter (can be changed)')
    .option('-t --title <title>', 'Custom title for the header')
    .option('-u --username <username>', 'Gerrit username')
    .option('-p --password <password>', 'Gerrit password')
    .option('-j --js', 'Save as JS file (useful for development)')
    .action((host, options) => __awaiter(this, void 0, void 0, function* () {
    const config = {
        host,
        backend: 'gerrit',
        title: options.title || undefined,
        days: options.days || 14,
        users: options.users ? options.users.split(',') : [],
    };
    let username = options.username;
    if (!username) {
        const answers = yield inquirer.prompt([{
                type: 'input',
                name: 'username',
                message: 'Username',
            }]);
        username = answers['username'];
    }
    let password = options.password;
    if (!password) {
        const answers = yield inquirer.prompt([{
                type: 'password',
                name: 'password',
                message: 'Password',
            }]);
        password = answers['password'];
    }
    try {
        const progressBar = new ProgressBar('Fetching data [:bar] :etas', { total: 100 });
        const data = yield gerrit_1.fetchGerritData(config, username, password, (progress) => {
            progressBar.update(progress <= 1 ? progress : 1);
        });
        saveData(data, options, config);
    }
    catch (e) {
        console.error('Failed to fetch Gerrit data:', e.message);
    }
}));
commander.command('random')
    .description('Create randomized code review stats for demo purpose')
    .option('-d --days <days>', 'Limit age of commits to use in stats')
    .option('-t --title <title>', 'Custom title for the header')
    .option('-j --js', 'Save as JS file (useful for development)')
    .action((options) => __awaiter(this, void 0, void 0, function* () {
    const config = {
        backend: 'random',
        title: options.title || undefined,
        days: options.days || 10,
        users: [],
    };
    const data = yield random_1.generateRandomData(config);
    saveData(data, options, config);
}));
// Invalid command
commander.on('command:*', () => {
    console.error('Invalid command: %s.', commander.args.join(' '));
    console.error('See --help for a list of available commands.');
    process.exit(1);
});
// No command given
if (!process.argv.slice(2).length) {
    commander.outputHelp();
    process.exit(1);
}
commander.parse(process.argv);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("commander");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("inquirer");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("progress");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs = __webpack_require__(6);
const createHtmlTemplate = (config, data, script) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Score Board</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.2.0/umd/react.production.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.2.0/umd/react-dom.production.min.js"></script>
  </head>
  <body>
  <script>
      window.config = ${config};
  </script>
  <script>
      window.data = ${data};
  </script>
  <script>
      ${script}
  </script>
  </body>
</html>`;
const createJsTemplate = (config, data) => `
  window.config = ${config};
  window.data = ${data};
`;
exports.createHtmlPage = (filename, config, data) => {
    const file = fs.openSync(filename, 'w');
    const indexJs = fs.readFileSync('./build/index.js').toString();
    fs.writeFileSync(file, createHtmlTemplate(JSON.stringify(config), JSON.stringify(data), indexJs));
};
exports.createJsScript = (filename, config, data) => {
    const file = fs.openSync(filename, 'w');
    fs.writeFileSync(file, createJsTemplate(JSON.stringify(config), JSON.stringify(data)));
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment = __webpack_require__(0);
const _ = __webpack_require__(8);
const USERS = ['Cordie', 'Priscilla', 'Myrna', 'Margarette', 'Delmar', 'Liliana', 'Philip',
    'Regine', 'Oma', 'Ashlee', 'Janette', 'Alvaro', 'Benito', 'Jenette', 'Flora', 'Scotty', 'Else',
    'Bryant', 'Treasa', 'Jacquiline'];
const PROJECTS = ['Proxy', 'Frontend', 'Backend', 'User', 'Authentication', 'Cache', 'Infra'];
const MAX_COMMITS_PER_DAY = 5;
const MIN_COMMITS_PER_DAY = 3;
const MAX_REVIEWS_PER_COMMIT = 3;
const MIN_REVIEWS_PER_COMMIT = 1;
exports.generateRandomData = (config) => __awaiter(this, void 0, void 0, function* () {
    return { changes: generateRandomChanges(config) };
});
const generateRandomChanges = (config) => {
    const ret = [];
    for (let i = 0; i < config.days; i++) {
        const created = moment().subtract(i, 'days');
        const updated = moment().subtract(i + _.random(i), 'days');
        const nbCommits = _.random(MIN_COMMITS_PER_DAY, MAX_COMMITS_PER_DAY);
        for (let j = 0; j < nbCommits; j++) {
            const user = _.sample(USERS);
            ret.push({
                id: i.toString(),
                project: getProject(user),
                branch: 'master',
                subject: `Commit ${i}-${j}`,
                owner: {
                    name: user,
                    email: `${user}@lud2k.github.com`,
                    username: user,
                },
                status: getStatus(i),
                created: created.toDate(),
                updated: updated.toDate(),
                insertions: _.random(10, 500),
                deletions: _.random(10, 500),
                mergeable: true,
                reviews: generateRandomReviews(config, user, created, updated),
                comments: generateRandomComments(config, user, created, updated),
                url: '#',
            });
        }
    }
    return ret;
};
const getProject = (user) => {
    const index = USERS.indexOf(user);
    let projects = PROJECTS.slice(Math.round(index / 3) * 3, Math.round(index / 3) * 3 + 3);
    if (projects.length == 0) {
        projects = PROJECTS;
    }
    return _.sample(projects);
};
const getReviewer = (user) => {
    const index = USERS.indexOf(user);
    const users = USERS.slice(Math.max(0, index - 2), Math.min(USERS.length, index + 2));
    return _.sample(users);
};
const getStatus = (i) => {
    const statuses = ['NEW'];
    for (let j = 0; j < i * 2; j++) {
        statuses.push('MERGED');
    }
    return _.sample(statuses);
};
const generateRandomReviews = (config, author, created, updated) => {
    const ret = [];
    const nbReviews = _.random(MIN_REVIEWS_PER_COMMIT, MAX_REVIEWS_PER_COMMIT);
    for (let j = 0; j < nbReviews; j++) {
        const user = getReviewer(author);
        ret.push({
            id: j.toString(),
            author: {
                name: user,
                email: `${user}@lud2k.github.com`,
                username: user,
            },
            date: created.toDate(),
            score: _.sample([-1, 1, 0, 2]),
            patchset: _.random(0, 10),
        });
    }
    return ret;
};
const generateRandomComments = (config, author, created, updated) => {
    const ret = [];
    const nbReviews = _.random(MIN_REVIEWS_PER_COMMIT, MAX_REVIEWS_PER_COMMIT);
    for (let j = 0; j < nbReviews; j++) {
        const user = getReviewer(author);
        ret.push({
            id: j.toString(),
            author: {
                name: user,
                email: `${user}@lud2k.github.com`,
                username: user,
            },
            date: created.toDate(),
            count: _.random(1, 6),
            patchset: _.random(0, 10),
        });
    }
    return ret;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __webpack_require__(10);
const moment = __webpack_require__(0);
const parse_1 = __webpack_require__(11);
exports.fetchGerritData = (config, username, password, progressFn) => __awaiter(this, void 0, void 0, function* () {
    const response = yield exports.login(config.host, username, password);
    const setCookieHeader = response.headers.get('set-cookie');
    const cookie = setCookieHeader.match(/GerritAccount=([^;]+)/)[1];
    return yield exports.getData(config, cookie, config.days, progressFn);
});
const get = (host, cookie, url) => __awaiter(this, void 0, void 0, function* () {
    const response = yield node_fetch_1.default(`${host}${url}`, {
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Cookie': `GerritAccount=${cookie};`,
        },
    });
    const data = yield response.text();
    const json = data.substr(5);
    return JSON.parse(json);
});
exports.login = (host, username, password) => __awaiter(this, void 0, void 0, function* () {
    const response = yield node_fetch_1.default(`${host}/login`, {
        method: 'POST',
        redirect: 'manual',
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: `username=${username}&password=${password}`,
    });
    if (response.status === 302) {
        return response;
    }
    else if (response.status === 401) {
        throw Error('Invalid username or password');
    }
    else {
        throw Error('An unknown error has happened:' + response.status);
    }
});
const getChanges = (host, cookie, query, count, start) => {
    return get(host, cookie, `/a/changes/?q=${query}&n=${count}&start=${start}&o=CURRENT_COMMIT&o=CURRENT_REVISION`);
};
const getChangeDetails = (host, cookie, id) => {
    return get(host, cookie, `/a/changes/${id}/detail`);
};
const getChangesUntil = (host, cookie, query) => __awaiter(this, void 0, void 0, function* () {
    let page = 0;
    let changes = yield getChanges(host, cookie, query, 50, page * 50);
    while (page < 50) {
        const newChanges = yield getChanges(host, cookie, query, 50, page * 50);
        changes = changes.concat(newChanges);
        if (newChanges.length < 50) {
            break;
        }
        page++;
    }
    return changes;
});
exports.batch = (inputs, count, progressFn) => __awaiter(this, void 0, void 0, function* () {
    const results = [];
    const threads = [];
    while (count--) {
        const thread = () => __awaiter(this, void 0, void 0, function* () {
            let input = inputs.pop();
            while (input) {
                results.push(yield input());
                progressFn(results.length / (results.length + inputs.length));
                input = inputs.pop();
            }
        });
        threads.push(thread());
    }
    yield Promise.all(threads);
    return results;
});
exports.getData = (config, cookie, nbDays, progressFn) => __awaiter(this, void 0, void 0, function* () {
    const afterDate = moment().subtract(nbDays, 'days').format('YYYY-MM-DD');
    const query = `after:${afterDate}`;
    progressFn(0);
    const changes = yield getChangesUntil(config.host, cookie, query);
    const promises = changes.map((change) => () => getChangeDetails(config.host, cookie, change._number));
    const details = yield exports.batch(promises, 5, progressFn);
    return { changes: parse_1.parseChanges(config, details) };
});


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const NB_COMMENTS_REGEX = new RegExp('^Patch Set (\\d+)\:\n\n\\((\\d+) comments?\\).*');
const CODE_REVIEW_REGEX = new RegExp('^Patch Set (\\d+)\: Code-Review([-+]\\d+).*');
const CODE_REVIEW_AND_COMMENTS_REGEX = new RegExp('^Patch Set (\\d+): Code-Review([-+]\\d+)\n\n\\((\\d+) comments?\\).*');
exports.parseChanges = (config, changes) => {
    return changes.map((change) => exports.parseChange(config, change));
};
exports.parseChange = (config, change) => {
    return {
        id: change._number,
        project: change.project,
        branch: change.branch,
        subject: change.subject,
        owner: change.owner,
        status: change.status,
        created: new Date(change.created),
        updated: new Date(change.updated),
        insertions: change.insertions,
        deletions: change.deletions,
        mergeable: change.mergeable,
        reviews: exports.parseReviews(change.messages),
        comments: exports.parseComments(change.messages),
        url: `${config.host}/#/c/${change._number}/`,
    };
};
exports.parseReviews = (messages) => {
    const ret = [];
    messages.forEach((message) => {
        const match = CODE_REVIEW_REGEX.exec(message.message);
        if (match) {
            ret.push({
                id: message.id,
                author: message.author,
                date: new Date(message.date),
                score: parseInt(match[2], 10),
                patchset: message._revision_number,
            });
        }
    });
    return ret;
};
exports.parseComments = (messages) => {
    const ret = [];
    messages.forEach((message) => {
        let match = NB_COMMENTS_REGEX.exec(message.message);
        if (match) {
            ret.push({
                id: message.id,
                author: message.author,
                date: new Date(message.date),
                count: parseInt(match[2], 10),
                patchset: message._revision_number,
            });
        }
        match = CODE_REVIEW_AND_COMMENTS_REGEX.exec(message.message);
        if (match) {
            ret.push({
                id: message.id,
                author: message.author,
                date: new Date(message.date),
                count: parseInt(match[3], 10),
                patchset: message._revision_number,
            });
        }
    });
    return ret;
};


/***/ })
/******/ ]);