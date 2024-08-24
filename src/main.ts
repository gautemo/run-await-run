import { waitResponse } from '@gaute/await-response'
import { convertArgs, convertIfPort } from './utilsArgs'
import { spawn } from 'node:child_process'

export async function handleArgs(args: string[]) {
  args = await convertArgs(args)
  let method: 'HEAD' | 'GET' = 'HEAD'
  if(args.includes('--get')) {
    method = 'GET'
    args = args.filter(a => a !== '--get')
  }
  let timeout: number | undefined = undefined
  if(args.includes('--timeout')) {
    const index = args.indexOf('--timeout')
    timeout = parseInt(args[index + 1] ?? '')
    if(Number.isNaN(timeout)) {
      throw new Error('--timeout needs to be followed by a number')
    }
    args.splice(index, 2)
  }
  let interval: number | undefined = undefined
  if(args.includes('--interval')) {
    const index = args.indexOf('--interval')
    interval = parseInt(args[index + 1] ?? '')
    if(Number.isNaN(interval)) {
      throw new Error('--interval needs to be followed by a number')
    }
    args.splice(index, 2)
  }
  if(args.length !== 3) {
    throw new Error('expected: run-await-run <script> <url or port> <script>')
  }
  spawn(args[0]!, { shell: true, stdio: 'inherit' })
  await waitResponse(convertIfPort(args[1]!), {
    method,
    timeout,
    interval,
  })
  spawn(args[2]!, { shell: true, stdio: 'inherit' })
}
