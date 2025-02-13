import { blue, cyan, magenta, red } from '@std/fmt/colors'

export function logInfo(msg: string, options: { key: string, type: '1' | '2' | 'await' }) {
  const colorFns = {
    '1': blue,
    '2': cyan,
    'await': magenta,
  } as const
  console.log(`${colorFns[options.type](`[${options.key}]`)} ${msg.trim()}`)
}

export function logError(msg: string, options: { key: string }) {
  console.error(red(`[${options.key}] ${msg.trim()}`))
}