import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import axios from 'axios'

import { prisma } from '@/lib/prisma'

export async function authRoutes(app: FastifyInstance): Promise<any> {
  app.post('/register', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const accessTokenSchema = z.object({
      access_token: z.string(),
    })

    const { access_token } = accessTokenSchema.parse(accessTokenResponse.data)

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      avatar_url: z.string().url(),
      id: z.number(),
      login: z.string(),
      name: z.string(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    })

    if (user == null) {
      user = await prisma.user.create({
        data: {
          avatarUrl: userInfo.avatar_url,
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
        },
      })
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    )

    return { token }
  })
}
