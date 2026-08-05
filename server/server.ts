import express from 'express'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { WebSocketServer } from 'ws'
import chokidar from 'chokidar'
import { createServer as createViteServer } from 'vite'

const root = resolve(import.meta.dirname, '..')
const fileArgumentIndex = process.argv.findIndex((argument) => argument === '--file')
const fileArgument = fileArgumentIndex >= 0 ? process.argv[fileArgumentIndex + 1] : undefined
const inlineFileArgument = process.argv
  .find((argument) => argument.startsWith('--file='))
  ?.slice('--file='.length)
const configuredFile =
  fileArgument || inlineFileArgument || process.env.DIALOGUE_FILE || 'dialogue.txt'
const dialoguePath = resolve(configuredFile)
const port = Number(process.env.PORT ?? 3000)
const app = express()
const httpServer = createServer(app)
const sockets = new WebSocketServer({ server: httpServer, path: '/ws' })

function broadcast(text: string) {
  const payload = JSON.stringify({ type: 'dialogue', text })
  sockets.clients.forEach((client) => {
    if (client.readyState === 1) client.send(payload)
  })
}

let lastText = ''
let readTimer: NodeJS.Timeout | undefined
async function publishFile() {
  try {
    const text = (await readFile(dialoguePath, 'utf8')).trim()
    if (!text || text === lastText) return
    lastText = text
    broadcast(text)
  } catch {
    /* A missing file is valid; chokidar will pick it up when created. */
  }
}

const watcher = chokidar.watch(dialoguePath, {
  ignoreInitial: true,
  usePolling: true,
  interval: 100,
  awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 25 },
})
const schedulePublish = () => {
  clearTimeout(readTimer)
  readTimer = setTimeout(publishFile, 30)
}
watcher.on('add', schedulePublish).on('change', schedulePublish)

sockets.on('connection', (socket) => {
  readFile(dialoguePath, 'utf8')
    .then((value) => {
      const text = value.trim()
      if (text) {
        lastText = text
        socket.send(JSON.stringify({ type: 'dialogue', text }))
      }
    })
    .catch(() => {
      /* Missing dialogue.txt is valid. */
    })
})

const vite = await createViteServer({ root, server: { middlewareMode: true }, appType: 'spa' })
app.use(vite.middlewares)
httpServer.listen(port, () => {
  console.log('\x1b[32m%s\x1b[0m', `TextBoxy is live!`)
  console.log(`Watching dialogue file: ${dialoguePath}`)
  console.log(`Add a new Browser Source in OBS with the URL: http://localhost:${port}`)
  console.log('\x1b[90m%s\x1b[0m', `Debugging: http://localhost:${port}?debug=1`)
})
