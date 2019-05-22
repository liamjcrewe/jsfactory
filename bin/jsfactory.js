#! /usr/bin/env node
const program = require('commander')
const inquirer = require('inquirer')

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

const run = async () => {
  console.log('Running...')

  console.log('Gathering inputs...')
  const { name, description, author, license } = await gatherInputs()

  console.log(name, description, author, license)
}

program.version('0.0.1').parse(process.argv)

run()
