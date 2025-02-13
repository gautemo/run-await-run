import { blue, cyan, magenta, red } from '@std/fmt/colors'

export function logInfo(msg: string, options: { key: string, type: '1' | '2' | 'await' }) {
  const colorFn = {
    '1': blue,
    '2': cyan,
    'await': magenta,
  }[options.type]
  msg = msg.trim()
  if(isMultiline(msg)) {
    console.log(colorFn(`[${options.key}] ▼`))
    console.log(msg)
  } else {
    console.log(`${colorFn(`[${options.key}]`)} ${msg}`)
  }
}

export function logError(msg: string, options: { key: string }) {
  msg = msg.trim()
  if(isMultiline(msg)) {
    console.error(red(`[${options.key}] ▼`))
    console.error(msg)
  } else {
    console.error(red(`[${options.key}] ${msg}`))
  }
}

function isMultiline(msg: string) {
  return msg.indexOf('\n') !== -1
}