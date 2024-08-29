import { waitResponse } from '@gaute/await-response'
import { addNpmRunIfArgIsScript, convertIfPort, getCommand, getPackageJSONScripts } from './utilsArgs'
import { spawn } from './spawn'

export async function handleArgs(args: string[]) {
  const firstCommand = getCommand(args)
  const url = args.splice(0, 1)[0]
  const secondCommand = getCommand(args)
  if(!firstCommand || !url || !secondCommand) {
    throw new Error('expected: run-await-run <script> <url or port> <script>')
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
  const killSpawned = spawn({ arg: addNpmRunIfArgIsScript(firstCommand, packageJSONScripts) })
  await waitResponse(convertIfPort(url), {
    method: args.includes('--get') ? 'GET' : 'HEAD',
    timeout,
    interval,
  }).catch(error => {
    console.error(`await error:\n${error}`)
    killSpawned()
  })
  spawn({ 
    arg: addNpmRunIfArgIsScript(secondCommand, packageJSONScripts),
    onExit() {
      if(!args.includes('--keep-running')) {
        killSpawned()
      }
    }
  })
}
