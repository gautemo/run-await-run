import { spawn as nodeSpawn } from 'node:child_process'
import process from 'node:process'
import kill from 'tree-kill'
import { logError } from './log'

const manuallyEndedTypes: ('1' | '2')[] = []

export function spawn(options: { arg: string, type: '1' | '2', onExit?: () => void }) {
  const task = nodeSpawn(options.arg, { shell: true, stdio: 'inherit' })
  
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

  return () => {
    if(task.pid) {
      manuallyEndedTypes.push(options.type)
      kill(task.pid)
    }
  }
}