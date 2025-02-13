import { waitResponse } from '@gaute/await-response'
import { addNpmRunIfArgIsScript, convertIfPort, getCommand, getPackageJSONScripts } from './utilsArgs'
import { spawn } from './spawn'
import { logError, logInfo } from './log'

export async function handleArgs(args: string[]) {
  const firstCommand = getCommand(args)
  const urlInput = args.splice(0, 1)[0]
  const secondCommand = getCommand(args)
  if(!firstCommand || !urlInput || !secondCommand) {
    logError('run-await-run <script> <url or port> <script>', { key: 'expected' })
    process.exit(1)
  }
  let timeout: number | undefined = undefined
  if(args.includes('--timeout')) {
    timeout = parseInt(args[args.indexOf('--timeout') + 1] ?? '')
    if(Number.isNaN(timeout)) {
      logError('needs to be followed by a number', { key: '--timeout' })
      process.exit(1)
    }
  }
  let interval: number | undefined = undefined
  if(args.includes('--interval')) {
    interval = parseInt(args[args.indexOf('--interval') + 1] ?? '')
    if(Number.isNaN(interval)) {
      logError('needs to be followed by a number', { key: '--interval' })
      process.exit(1)
    }
  }

  const packageJSONScripts = await getPackageJSONScripts()
  const killSpawned = spawn({ arg: addNpmRunIfArgIsScript(firstCommand, packageJSONScripts), type: '1' })
  
  const url = convertIfPort(urlInput)
  const method = args.includes('--get') ? 'GET' : 'HEAD'
  logInfo(`${method} ${url} (timeout=${timeout ?? 60_000}ms, interval=${interval ?? 100}ms)`, { key: 'await', type: 'await' })
  await waitResponse(url, {
    method,
    timeout,
    interval,
  }).catch(error => {
    logError(error, { key: 'await' })
    killSpawned()
    process.exit(1)
  })

  spawn({ 
    arg: addNpmRunIfArgIsScript(secondCommand, packageJSONScripts),
    type: '2',
    onExit() {
      killSpawned()
    }
  })
}
