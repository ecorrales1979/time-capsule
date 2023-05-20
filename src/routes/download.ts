import { createReadStream } from 'node:fs';
import { resolve } from 'node:path';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';

export async function downloadRoutes(app: FastifyInstance): Promise<any> {
  app.get('/download/:filename', async (request, reply) => {
    const paramsSchema = z.object({
      filename: z.string(),
    })

    const { filename } = paramsSchema.parse(request.params)

    const filePath = resolve(__dirname, '../../storage/uploads', filename)

    const stream = createReadStream(filePath)

    return reply.send(stream).code(200)
  })
}
