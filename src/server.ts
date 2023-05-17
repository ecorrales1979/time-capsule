import fastify from 'fastify'
import cors from '@fastify/cors'

import { memoriesRoutes } from './routes/memories'

const app = fastify()

void app.register(cors, {
  origin: true,
})

app.get('/', () => {
  return 'Hello World!'
})

void app.register(memoriesRoutes)

app
  .listen({ port: 3333 })
  .then(() => {
    console.log('🚀 HTTP server running on http://localhost:3333')
  })
  .catch((error: Error) => {
    console.error(error)
  })
