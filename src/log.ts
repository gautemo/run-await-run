import { cyan, red } from '@std/fmt/colors'

export function logInfo(msg: string, options: { key: string }) {
  console.log(`${cyan(`${options.key} ▸`)} ${msg.trim()}`)
}

export function logError(msg: string, options: { key: string }) {
  console.error(red(`${options.key} ▸ ${msg.trim()}`))
}
