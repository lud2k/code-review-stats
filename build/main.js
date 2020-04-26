#!/usr/bin/env node
!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=require("moment")},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{c(o.next(e))}catch(e){a(e)}}function i(e){try{c(o.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}c((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=n(2),a=n(3),s=n(4),i=n(5),c=n(8),d=n(10),u=(e,t,n)=>{const o=Date.now();t.js?(i.createJsScript(`${o}.js`,n,e),console.info(`Code Review Stats saved in ${o}.js`)):(i.createHtmlPage(`${o}.html`,n,e),console.info(`Code Review Stats saved in ${o}.html`))};r.version("1.0.0"),r.command("gerrit <host>").description("Create code review stats fetching data from Gerrit").option("-d --days <days>","Limit age of commits to use in stats").option("-l --users <users>","Comma delimited list of users to use as default filter (can be changed)").option("-t --title <title>","Custom title for the header").option("-u --username <username>","Gerrit username").option("-p --password <password>","Gerrit password").option("-j --js","Save as JS file (useful for development)").action((e,t)=>o(void 0,void 0,void 0,(function*(){const n={host:e,backend:"gerrit",title:t.title||void 0,days:t.days||14,users:t.users?t.users.split(","):[]};let o=t.username;if(!o){o=(yield a.prompt([{type:"input",name:"username",message:"Username"}])).username}let r=t.password;if(!r){r=(yield a.prompt([{type:"password",name:"password",message:"Password"}])).password}try{const e=new s("Fetching data [:bar] :etas",{total:100}),a=yield d.fetchGerritData(n,o,r,t=>{e.update(t<=1?t:1)});u(a,t,n)}catch(e){console.error("Failed to fetch Gerrit data:",e.message)}}))),r.command("random").description("Create randomized code review stats for demo purpose").option("-d --days <days>","Limit age of commits to use in stats").option("-t --title <title>","Custom title for the header").option("-j --js","Save as JS file (useful for development)").action(e=>o(void 0,void 0,void 0,(function*(){const t={backend:"random",title:e.title||void 0,days:e.days||10,users:c.USERS},n=yield c.generateRandomData(t);u(n,e,t)}))),r.on("command:*",()=>{console.error("Invalid command: %s.",r.args.join(" ")),console.error("See --help for a list of available commands."),process.exit(1)}),process.argv.slice(2).length||(r.outputHelp(),process.exit(1)),r.parse(process.argv)},function(e,t){e.exports=require("commander")},function(e,t){e.exports=require("inquirer")},function(e,t){e.exports=require("progress")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(6),r=n(7);t.createHtmlPage=(e,t,n)=>{const a=o.openSync(e,"w"),s=o.readFileSync(r.resolve(__dirname,"index.js")).toString();o.writeFileSync(a,((e,t,n)=>`<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8" /> \n    <title>Code Review Stats</title>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.13.1/umd/react.production.min.js"><\/script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.13.1/umd/react-dom.production.min.js"><\/script>\n  </head>\n  <body>\n  <script>\n      window.config = ${e};\n  <\/script>\n  <script>\n      window.data = ${t};\n  <\/script>\n  <script>\n      ${n}\n  <\/script>\n  </body>\n</html>`)(JSON.stringify(t),JSON.stringify(n),s))},t.createJsScript=(e,t,n)=>{const r=o.openSync(e,"w");o.writeFileSync(r,((e,t)=>`\n  window.config = ${e};\n  window.data = ${t};\n`)(JSON.stringify(t),JSON.stringify(n)))}},function(e,t){e.exports=require("fs")},function(e,t){e.exports=require("path")},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{c(o.next(e))}catch(e){a(e)}}function i(e){try{c(o.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}c((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=n(0),a=n(9);t.USERS=["Cordie","Priscilla","Myrna","Margarette","Delmar","Liliana","Philip","Regine","Oma","Ashlee","Janette","Alvaro","Benito","Jenette","Flora","Scotty","Else","Bryant","Treasa","Jacquiline"];const s=["Proxy","Frontend","Backend","User","Authentication","Cache","Infra"];t.generateRandomData=e=>o(void 0,void 0,void 0,(function*(){return{changes:i(e)}}));const i=e=>{const n=[];for(let o=0;o<e.days;o++){const s=r().subtract(o,"days"),i=r().subtract(o+a.random(o),"days"),d=a.random(3,5);for(let r=0;r<d;r++){const d=a.sample(t.USERS);n.push({id:o.toString(),project:c(d),branch:"master",subject:`Commit ${o}-${r}`,owner:{name:d,email:`${d}@lud2k.github.com`,username:d},status:u(o),created:s.toDate(),updated:i.toDate(),insertions:a.random(10,500),deletions:a.random(10,500),mergeable:!0,reviews:l(e,d,s,i,o.toString()),comments:p(e,d,s,i,o.toString()),url:"#"})}}return n},c=e=>{const n=t.USERS.indexOf(e);let o=s.slice(3*Math.round(n/3),3*Math.round(n/3)+3);return 0===o.length&&(o=s),a.sample(o)},d=e=>{const n=t.USERS.indexOf(e),o=t.USERS.slice(Math.max(0,n-2),Math.min(t.USERS.length,n+2));return a.sample(o)},u=e=>{const t=["NEW"];for(let n=0;n<2*e;n++)t.push("MERGED");return a.sample(t)},l=(e,t,n,o,r)=>{const s=[],i=a.random(1,3);for(let e=0;e<i;e++){const o=d(t);s.push({id:e.toString(),author:{name:o,email:`${o}@lud2k.github.com`,username:o},date:n.toDate(),score:a.sample([-1,1,0,2]),patchset:a.random(0,10),changeId:r})}return s},p=(e,t,n,o,r)=>{const s=[],i=a.random(1,3);for(let e=0;e<i;e++){const o=d(t);s.push({id:e.toString(),author:{name:o,email:`${o}@lud2k.github.com`,username:o},date:n.toDate(),count:a.random(1,6),patchset:a.random(0,10),changeId:r})}return s}},function(e,t){e.exports=require("lodash")},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function s(e){try{c(o.next(e))}catch(e){a(e)}}function i(e){try{c(o.throw(e))}catch(e){a(e)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,i)}c((o=o.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const r=n(11),a=n(0),s=n(12);t.fetchGerritData=(e,n,r,a)=>o(void 0,void 0,void 0,(function*(){const o=(yield t.login(e.host,n,r)).headers.get("set-cookie").match(/GerritAccount=([^;]+)/)[1];return yield t.getData(e,o,e.days,a)}));const i=(e,t,n)=>o(void 0,void 0,void 0,(function*(){const o=yield r.default(`${e}${n}`,{headers:{Accept:"application/json, application/xml, text/plain, text/html, *.*","Content-Type":"application/x-www-form-urlencoded; charset=utf-8",Cookie:`GerritAccount=${t};`}}),a=(yield o.text()).substr(5);return JSON.parse(a)}));t.login=(e,t,n)=>o(void 0,void 0,void 0,(function*(){const o=yield r.default(`${e}/login`,{method:"POST",redirect:"manual",headers:{Accept:"application/json, application/xml, text/plain, text/html, *.*","Content-Type":"application/x-www-form-urlencoded; charset=utf-8"},body:`username=${t}&password=${n}`});if(302===o.status)return o;throw 401===o.status?Error("Invalid username or password"):Error("An unknown error has happened:"+o.status)}));const c=(e,t,n,o,r)=>i(e,t,`/a/changes/?q=${n}&n=${o}&start=${r}&o=CURRENT_COMMIT&o=CURRENT_REVISION`);t.batch=(e,t,n)=>o(void 0,void 0,void 0,(function*(){const r=[],a=[];for(;t--;){const t=()=>o(void 0,void 0,void 0,(function*(){let t=e.pop();for(;t;)r.push(yield t()),n(r.length/(r.length+e.length)),t=e.pop()}));a.push(t())}return yield Promise.all(a),r})),t.getData=(e,n,r,d)=>o(void 0,void 0,void 0,(function*(){const u=`after:${a().subtract(r,"days").format("YYYY-MM-DD")}`;d(0);const l=(yield((e,t,n)=>o(void 0,void 0,void 0,(function*(){let o=0,r=[];for(;o<500;){const a=yield c(e,t,n,50,50*o);if(r=r.concat(a),a.length<50)break;o++}return r})))(e.host,n,u)).map(t=>()=>((e,t,n)=>i(e,t,`/a/changes/${n}/detail`))(e.host,n,t._number)),p=yield t.batch(l,5,d);return{changes:s.parseChanges(e,p)}}))},function(e,t){e.exports=require("node-fetch")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=new RegExp("^Patch Set (\\d+):\n\n\\((\\d+) comments?\\).*"),r=new RegExp("^Patch Set (\\d+): Code-Review([-+]\\d+).*"),a=new RegExp("^Patch Set (\\d+): Code-Review([-+]\\d+)\n\n\\((\\d+) comments?\\).*");t.parseChanges=(e,n)=>n.map(n=>t.parseChange(e,n)),t.parseChange=(e,n)=>({id:n._number,project:n.project,branch:n.branch,subject:n.subject,owner:n.owner,status:n.status,created:new Date(n.created),updated:new Date(n.updated),insertions:n.insertions,deletions:n.deletions,mergeable:n.mergeable,reviews:t.parseReviews(n.messages),comments:t.parseComments(n.messages),url:`${e.host}/#/c/${n._number}/`}),t.parseReviews=e=>{const t=[];return e.forEach(e=>{const n=r.exec(e.message);n&&t.push({id:e.id,author:e.author,date:new Date(e.date),score:parseInt(n[2],10),patchset:e._revision_number})}),t},t.parseComments=e=>{const t=[];return e.forEach(e=>{let n=o.exec(e.message);n&&t.push({id:e.id,author:e.author,date:new Date(e.date),count:parseInt(n[2],10),patchset:e._revision_number}),n=a.exec(e.message),n&&t.push({id:e.id,author:e.author,date:new Date(e.date),count:parseInt(n[3],10),patchset:e._revision_number})}),t}}]);