#! /usr/bin/env node
const fs = require('fs-extra')
const shell = require('shelljs')
const program = require('commander')
const inquirer = require('inquirer')
const replace = require('replace-in-file')

const gatherInputs = () =>
  inquirer.prompt([
    {
      name: 'name',
      message: 'Name: '
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

const run = async () => {
  console.log('Running...')

  console.log('Gathering inputs...')
  const { name, description, author, license } = await gatherInputs()

  console.log(name, description, author, license)

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

  shell.exec(`(cd ${path} && yarn)`)
}

program.version('0.0.1').parse(process.argv)

run()
