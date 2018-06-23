import * as fs from 'fs'
import * as path from 'path'
import {Config} from './config'
import {Data} from './backend/models'

const createHtmlTemplate = (config: string, data: string, script: string) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Code Review Stats</title>
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
</html>`

const createJsTemplate = (config: string, data: string) => `
  window.config = ${config};
  window.data = ${data};
`

export const createHtmlPage = (filename: string, config: Config, data: Data) => {
    const file = fs.openSync(filename, 'w')
    const indexJs = fs.readFileSync(path.resolve(__dirname, 'index.js')).toString()
    fs.writeFileSync(file, createHtmlTemplate(JSON.stringify(config), JSON.stringify(data), indexJs))
}

export const createJsScript = (filename: string, config: Config, data: Data) => {
    const file = fs.openSync(filename, 'w')
    fs.writeFileSync(file, createJsTemplate(JSON.stringify(config), JSON.stringify(data)))
}
