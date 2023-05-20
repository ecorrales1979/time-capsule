import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'

import 'dotenv/config'

import { authRoutes } from './routes/auth'
import { downloadRoutes } from './routes/download'
import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'

const app = fastify({
  logger: {
    level: 'info',
    file: './storage/logs/log.txt',
  },
})

void app.register(multipart)

void app.register(cors, {
  origin: true,
})

void app.register(jwt, {
  secret: process.env.JWT_SECRET as string,
})

app.get('/', () => {
  return 'Hello World!'
})

void app.register(authRoutes)
void app.register(memoriesRoutes)
void app.register(uploadRoutes)
void app.register(downloadRoutes)

const port = process.env.SERVER_PORT ?? 3333

app
  .listen({ port: Number(port) })
  .then(() => {
    console.log(`🚀 HTTP server running on http://localhost:${port}`)
  })
  .catch((error: Error) => {
    console.error(error)
    app.log.error(error)
    process.exit(1)
  })
