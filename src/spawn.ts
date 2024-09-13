import { spawn as nodeSpawn } from 'node:child_process'
import process from 'node:process'
import kill from 'tree-kill'

export function spawn(options: { arg: string, onExit?: () => void }) {
  const task = nodeSpawn(options.arg, { shell: true, stdio: 'inherit' })
  task.on('exit', () => {
    options.onExit?.()
  })
  task.on('error', (error) => {
    console.error(`${options.arg} error:\n${error}`)
    process.exit(1)
  })
  return () => {
    if(task.pid) {
      kill(task.pid)
    }
  }
}