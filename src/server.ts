import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import 'dotenv/config'

import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'

const app = fastify()

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

const port = process.env.SERVER_PORT ?? 3333

app
  .listen({ port: Number(port) })
  .then(() => {
    console.log(`🚀 HTTP server running on http://localhost:${port}`)
  })
  .catch((error: Error) => {
    console.error(error)
  })
