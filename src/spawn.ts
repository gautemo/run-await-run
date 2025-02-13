import { spawn as nodeSpawn } from 'node:child_process'
import process from 'node:process'
import kill from 'tree-kill'
import { logError, logInfo } from './log'

const manuallyEndedTypes: ('1' | '2')[] = []

export function spawn(options: { arg: string, type: '1' | '2', onExit?: () => void }) {
  const task = nodeSpawn(options.arg, { shell: true })
  
  task.on('exit', (code) => {
    if(code && code > 0 && !manuallyEndedTypes.includes(options.type)) {
      process.exitCode = code
    }
    options.onExit?.()
  })
  
  task.on('error', (error) => {
    logError(error.message, { key: options.arg })
    process.exit(1)
  })
  
  task.stdout.on('data', data => logInfo(Buffer.from(data,'utf-8').toString(), { key: options.arg, type: options.type }))
  task.stderr.on('data', data => logError(Buffer.from(data,'utf-8').toString(), { key: options.arg }))

  return () => {
    if(task.pid) {
      manuallyEndedTypes.push(options.type)
      kill(task.pid)
    }
  }
}