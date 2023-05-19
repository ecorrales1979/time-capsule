import { type FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../lib/prisma'
import { authMiddleware } from '@/middlewares/auth'

const paramsSchema = z.object({
  id: z.string().uuid(),
})

const bodySchema = z.object({
  coverUrl: z.string().url(),
  content: z.string(),
  isPublic: z.coerce.boolean().default(false),
})

export async function memoriesRoutes(app: FastifyInstance): Promise<any> {
  app.addHook('preHandler', authMiddleware)

  app.get('/memories', async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => ({
      ...memory,
      content: memory.content.substring(0, 120).concat('...'),
    }))
  })

  app.get('/memories/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    return memory
  })

  app.post('/memories', async (request) => {
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)
    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    })
    return memory
  })

  app.put('/memories/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params)
    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)
    const memory = await prisma.memory.update({
      where: { id },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })
    return memory
  })

  app.delete('/memories/:id', async (request) => {
    const { id } = paramsSchema.parse(request.params)
    await prisma.memory.delete({
      where: { id },
    })
  })
}
