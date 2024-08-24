import fs from 'node:fs/promises'

export async function convertArgs(args: string[]) {
  const argsConverted: string[] = []
  const packageJSONString = await fs.readFile('package.json', { encoding: 'utf-8' })
  const packageJSONScripts: Record<string, string> = JSON.parse(packageJSONString).scripts
  for(const arg of groupArgs(args)) {
    if(await argIsScript(arg, packageJSONScripts)) {
      argsConverted.push(`npm run ${arg}`)
    } else {
      argsConverted.push(arg)
    }
  }
  return argsConverted
}

function groupArgs(args: string[]) {
  const argsGrouped: string[] = []
  for(let i = 0; i < args.length; i++) {
    if(args[i]?.startsWith(`'`) && args.slice(i + 1).some(a => a.endsWith(`'`))) {
      const group = [args[i]]
      let startQuotes = 1
      for(let j = i + 1; j < args.length; j++) {
        group.push(args[j])
        if(args[j]?.startsWith(`'`)) {
          startQuotes++
        }
        if(args[j]?.endsWith(`'`)) {
          startQuotes--
          if(startQuotes === 0) {
            i = j
            break
          }
        }
      }
      const command = group.join(' ')
      argsGrouped.push(command.substring(1, command.length - 1))
    } else {
      argsGrouped.push(args[i]!)
    }
  }
  return argsGrouped
}

function argIsScript(arg: string, scripts: Record<string, string>) {
  return Object.keys(scripts).includes(arg.split(' ')[0]!)
}

export function convertIfPort(arg: string) {
  if(arg.startsWith(':')) {
    return `http://localhost${arg}/`
  }
  return arg
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  
  it('convert nothing', () => {
    expect(groupArgs(['one', 'two'])).toStrictEqual(['one', 'two'])
  })
  
  it('combine commands', () => {
    expect(groupArgs(['one', `'two`, `three'`])).toStrictEqual(['one', 'two three'])
  })

  it('not combine nested commands', () => {
    expect(groupArgs(['one', `'two`, `'sub`, `end-sub'`, `three'`])).toStrictEqual(['one', `two 'sub end-sub' three`])
  })

  it('test is in package.json scripts', async () => {
    expect(await argIsScript('test', { test: '' })).toBe(true)
  })

  it('convert args', async () => {
    expect(await convertArgs(['test', 'http://localhost:3000', `'npx`, `yo'`])).toStrictEqual(['npm run test', 'http://localhost:3000', 'npx yo'])
  })

  it('convert port', () => {
    expect(convertIfPort(':3000')).toBe('http://localhost:3000/')
  })
}