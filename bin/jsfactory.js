#! /usr/bin/env node
const program = require('commander')

const run = () => {
  console.log('Running...')
}

program.version('0.0.1').parse(process.argv)

run()
