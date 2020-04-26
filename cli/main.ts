import * as commander from 'commander'
import * as inquirer from 'inquirer'
import * as ProgressBar from 'progress'
import { createHtmlPage, createJsScript } from './template'
import { Config } from './config'
import { generateRandomData, USERS } from './backend/random/random'
import { fetchGerritData } from './backend/gerrit/gerrit'
import { Data } from './backend/models'

const saveData = (data: Data, options: any, config: Config) => {
  const filename = Date.now()
  if (!options.js) {
    createHtmlPage(`${filename}.html`, config, data)
    console.info(`Code Review Stats saved in ${filename}.html`)
  } else {
    createJsScript(`${filename}.js`, config, data)
    console.info(`Code Review Stats saved in ${filename}.js`)
  }
}

commander.version('1.0.0')

commander
  .command('gerrit <host>')
  .description('Create code review stats fetching data from Gerrit')
  .option('-d --days <days>', 'Limit age of commits to use in stats')
  .option(
    '-l --users <users>',
    'Comma delimited list of users to use as default filter (can be changed)'
  )
  .option('-t --title <title>', 'Custom title for the header')
  .option('-u --username <username>', 'Gerrit username')
  .option('-p --password <password>', 'Gerrit password')
  .option('-j --js', 'Save as JS file (useful for development)')
  .action(async (host, options) => {
    const config: Config = {
      host,
      backend: 'gerrit',
      title: options.title || undefined,
      days: options.days || 14,
      users: options.users ? options.users.split(',') : [],
    }

    let username = options.username
    if (!username) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'username',
          message: 'Username',
        },
      ])
      username = answers['username']
    }

    let password = options.password
    if (!password) {
      const answers = await inquirer.prompt([
        {
          type: 'password',
          name: 'password',
          message: 'Password',
        },
      ])
      password = answers['password']
    }

    try {
      const progressBar = new ProgressBar('Fetching data [:bar] :etas', { total: 100 })
      const data = await fetchGerritData(config, username, password, (progress: number) => {
        progressBar.update(progress <= 1 ? progress : 1)
      })
      saveData(data, options, config)
    } catch (e) {
      console.error('Failed to fetch Gerrit data:', e.message)
    }
  })

commander
  .command('random')
  .description('Create randomized code review stats for demo purpose')
  .option('-d --days <days>', 'Limit age of commits to use in stats')
  .option('-t --title <title>', 'Custom title for the header')
  .option('-j --js', 'Save as JS file (useful for development)')
  .action(async options => {
    const config: Config = {
      backend: 'random',
      title: options.title || undefined,
      days: options.days || 10,
      users: USERS,
    }

    const data = await generateRandomData(config)
    saveData(data, options, config)
  })

// Invalid command
commander.on('command:*', () => {
  console.error('Invalid command: %s.', commander.args.join(' '))
  console.error('See --help for a list of available commands.')
  process.exit(1)
})

// No command given
if (!process.argv.slice(2).length) {
  commander.outputHelp()
  process.exit(1)
}

commander.parse(process.argv)
