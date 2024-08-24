#!/usr/bin/env node

import { handleArgs } from '../dist/main.js'

const argv = process.argv.slice(2)
handleArgs(argv)
