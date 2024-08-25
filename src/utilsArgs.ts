import fs from 'node:fs/promises'

export function getCommand(args: string[]) {
  let arg = args[0] ?? ''
  args.splice(0, 1)
  if(arg?.startsWith(`'`)) {
    let startQuotes = 1
    for(let i = 0; i < args.length; i++) {
      arg += ` ${args[i]}`
      if(args[i]?.startsWith(`'`)) startQuotes++
      if(args[i]?.endsWith(`'`)) startQuotes--
      if(startQuotes === 0) {
        args.splice(0, i + 1)
        arg = arg.substring(1, arg.length - 1)
        break
      }
    }
  }
  return arg
}

export function addNpmRunIfargIsScript(arg: string, scripts: Record<string, string>) {
  if(Object.keys(scripts).includes(arg.split(' ')[0]!)) {
    return `npm run ${arg}`
  }
  return arg
}

export async function getPackageJSONScripts(): Promise<Record<string, string>> {
  const packageJSONString = await fs.readFile('package.json', { encoding: 'utf-8' })
  return JSON.parse(packageJSONString).scripts
}

export function convertIfPort(arg: string) {
  if(arg.startsWith(':')) {
    return `http://localhost${arg}/`
  }
  return arg
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  
  it('get first command', () => {
    expect(getCommand(['one', 'two', 'three'])).toBe('one')
  })
  
  it('pop first command', () => {
    const args = ['one', 'two', 'three']
    getCommand(args)
    expect(args.length).toBe(2)
  })
  
  it('combine commands', () => {
    expect(getCommand([`'one`, `two'`])).toBe('one two')
  })

  it('not combine nested commands', () => {
    expect(getCommand([`'one`, `'sub`, `end-sub'`, `two'`])).toBe(`one 'sub end-sub' two`)
  })

  it('add npm run', async () => {
    expect(addNpmRunIfargIsScript('test', { test: '' })).toBe('npm run test')
  })

  it('not add npm run', async () => {
    expect(addNpmRunIfargIsScript('test', { })).toBe('test')
  })

  it('convert port', () => {
    expect(convertIfPort(':3000')).toBe('http://localhost:3000/')
  })
}