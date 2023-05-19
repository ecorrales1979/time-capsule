import { FastifyRequest } from 'fastify'

export async function authMiddleware(req: FastifyRequest): Promise<any> {
  await req.jwtVerify()
}
