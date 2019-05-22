#! /usr/bin/env node
const fs = require('fs-extra')
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
  console.log('Gathering inputs...')
  const { name, description, author, license } = await gatherInputs()

  console.log(`Generating ${name}...`)

  const path = `${process.cwd()}/${name}`

  if (directoryNotEmpty(path)) {
    console.error(`Directory ${path} exists and is not empty. Exiting...`)

    process.exit(1)
  }

  fs.copySync(`${__dirname}/../nextjs-react-app`, path)

  console.log('Setting up files...')

  replace.sync({
    files: [`${path}/package.json`, `${path}/README.md`],
    from: ['##NAME##', '##DESCRIPTION##', '##AUTHOR##', '##LICENSE##'],
    to: [name, description, author, license]
  })

  console.log('Installing packages...')

  shell.exec(`(cd ${path} && ${useNpm ? 'npm i' : 'yarn'})`)

  console.log('Done! You can start your app by running the following:')

  console.log(`  cd ${name}`)
  console.log(`  ${useNpm ? 'npm run' : 'yarn'} dev`)
}

program
  .version('0.0.1')
  .option('--use-npm', 'use npm rather than yarn to install packages')
  .parse(process.argv)

if (!program.useNpm && !isYarnInstalled()) {
  console.error('Yarn not found - install Yarn or run with --use-npm.')

  process.exit(1)
}

run(program.useNpm)
