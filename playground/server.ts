import { createApp, createRouter, defineEventHandler, toNodeListener } from 'h3'
import { createServer } from 'node:http'

console.log('server booting')

const app = createApp();
const router = createRouter()
app.use(router)

router.head('/', defineEventHandler(() => {
    return 'ready'
  }),
)

createServer(toNodeListener(app)).listen(8080)