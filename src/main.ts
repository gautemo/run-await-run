import { waitResponse } from '@gaute/await-response'
import { addNpmRunIfargIsScript, convertIfPort, getCommand, getPackageJSONScripts } from './utilsArgs'
import { spawn } from 'node:child_process'

export async function handleArgs(args: string[]) {
  const firstCommand = getCommand(args)
  const url = args[0]
  const secondCommand = getCommand(args)
  if(!firstCommand || !url || !secondCommand) {
    throw new Error('expected: run-await-run <script> <url or port> <script>')
  }
  let method: 'HEAD' | 'GET' = 'HEAD'
  if(args.includes('--get')) {
    method = 'GET'
  }
  let timeout: number | undefined = undefined
  if(args.includes('--timeout')) {
    timeout = parseInt(args[args.indexOf('--timeout') + 1] ?? '')
    if(Number.isNaN(timeout)) {
      throw new Error('--timeout needs to be followed by a number')
    }
  }
  let interval: number | undefined = undefined
  if(args.includes('--interval')) {
    interval = parseInt(args[args.indexOf('--interval') + 1] ?? '')
    if(Number.isNaN(interval)) {
      throw new Error('--interval needs to be followed by a number')
    }
  }
  const packageJSONScripts = await getPackageJSONScripts()
  spawn(addNpmRunIfargIsScript(firstCommand, packageJSONScripts), { shell: true, stdio: 'inherit' })
  await waitResponse(convertIfPort(url), {
    method,
    timeout,
    interval,
  })
  spawn(addNpmRunIfargIsScript(secondCommand, packageJSONScripts), { shell: true, stdio: 'inherit' })
}
