import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { extname, resolve } from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { type FastifyInstance } from 'fastify'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance): Promise<any> {
  app.post('/upload', async (request, reply) => {
    const media = await request.file({
      limits: {
        fileSize: 5_242_880, // 5MB
      },
    })

    if (media === undefined) {
      return await reply.status(400).send()
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(media.mimetype)

    if (!isValidFileFormat) {
      return await reply.status(400).send()
    }

    const fileId = randomUUID()
    const extension = extname(media.filename)
    const filename = fileId.concat(extension)

    const path = resolve(__dirname, '../../storage/uploads', filename)

    const writeStream = createWriteStream(path)

    await pump(media.file, writeStream)

    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/download/${filename}`, fullUrl).toString()

    return { fileUrl }
  })
}
