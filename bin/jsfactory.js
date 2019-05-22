#! /usr/bin/env node
const fs = require('fs-extra')
const chalk = require('chalk')
const shell = require('shelljs')
const program = require('commander')
const inquirer = require('inquirer')
const replace = require('replace-in-file')

const isYarnInstalled = () =>
  shell.exec('yarn --version', { silent: true }).code === 0

const gatherInputs = () =>
  inquirer.prompt([
    {
      name: 'name',
      message: 'Name: ',
      validate: input => {
        if (!input) return 'Name is required'
        if (input.includes(' ')) return 'Name cannot contain spaces'

        return true
      }
    },
    {
      name: 'description',
      message: 'Description: ',
      default: ''
    },
    {
      name: 'author',
      message: 'Author: ',
      default: ''
    },
    {
      name: 'license',
      message: 'License: ',
      default: 'MIT'
    }
  ])

const directoryNotEmpty = path =>
  fs.existsSync(path) && fs.readdirSync(path).length > 0

const run = async useNpm => {
  console.log(chalk.cyan('Gathering inputs...'))
  const { name, description, author, license } = await gatherInputs()

  console.log(chalk.cyan(`Generating ${chalk.bold(name)}...`))

  const path = `${process.cwd()}/${name}`

  if (directoryNotEmpty(path)) {
    console.error(
      chalk.red(
        `Directory ${chalk.bold(path)} exists and is not empty. Exiting...`
      )
    )

    process.exit(1)
  }

  fs.copySync(`${__dirname}/../nextjs-react-app`, path)

  console.log(chalk.cyan('Setting up files...'))

  replace.sync({
    files: [`${path}/package.json`, `${path}/README.md`],
    from: ['##NAME##', '##DESCRIPTION##', '##AUTHOR##', '##LICENSE##'],
    to: [name, description, author, license]
  })

  console.log(chalk.cyan('Installing packages...'))

  shell.exec(`(cd ${path} && ${useNpm ? 'npm i' : 'yarn'})`)

  console.log(
    chalk.bold.green.inverse(
      'Done! You can start your app by running the following:'
    )
  )

  console.log(chalk.green(`  cd ${name}`))
  console.log(chalk.green(`  ${useNpm ? 'npm run' : 'yarn'} dev`))
}

program
  .version('0.0.1')
  .option('--use-npm', 'use npm rather than yarn to install packages')
  .parse(process.argv)

if (!program.useNpm && !isYarnInstalled()) {
  console.error(
    chalk.red(
      `Yarn not found - install Yarn or run with ${chalk.bold('--use-npm')}.`
    )
  )

  process.exit(1)
}

run(program.useNpm)
