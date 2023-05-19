import fastify from 'fastify'
import cors from '@fastify/cors'

import 'dotenv/config'

import { memoriesRoutes } from './routes/memories'

const app = fastify()

void app.register(cors, {
  origin: true,
})

app.get('/', () => {
  return 'Hello World!'
})

void app.register(memoriesRoutes)

const port = process.env.SERVER_PORT ?? 3333

app
  .listen({ port: Number(port) })
  .then(() => {
    console.log(`🚀 HTTP server running on http://localhost:${port}`)
  })
  .catch((error: Error) => {
    console.error(error)
  })
