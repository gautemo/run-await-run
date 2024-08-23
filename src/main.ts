import { defineCommand } from "citty"
import { execSync } from 'node:child_process'
import { waitResponse } from "@gaute/await-response";

export const command = defineCommand({
  meta: {
    name: "run-await-run",
    version: "0.1.0",
    description: "Run command, await response, run command",
  },
  args: {
    run: {
      type: "positional",
      description: "Run first",
      required: true,
    },
    await: {
      type: "positional",
      description: "await response",
      required: true,
    },
    then: {
      type: "positional",
      description: "Then run",
      required: true,
    },
  },
  async run({ args }) {
    execSync(args.run, { stdio: 'inherit' })
    await waitResponse(args.await)
    execSync(args.then, { stdio: 'inherit' })
  },
});
