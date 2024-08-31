import { remixFastify } from '@mcansh/remix-fastify'
import { installGlobals } from '@remix-run/node'
import { fastify } from 'fastify'
import sourceMapSupport from 'source-map-support'
import Compress from '@fastify/compress'
import Helmet from '@fastify/helmet'
import Pino from 'pino'
import * as Config from './config.js'

installGlobals()
sourceMapSupport.install()

const logger = Pino(Config.logger)

const app = fastify({
  logger
})

app.setErrorHandler(async function (error, request, reply) {
  if (error.statusCode != null) {
    if (error.statusCode < 500) {
      logger.warn(error.message)
    } else {
      logger.error(error.message)
    }
    await reply.status(error.statusCode).send(error.message)
  } else {
    logger.error(error, 'UNHANDLED ERROR')
    await reply.status(500).send('Internal Server Error')
  }
})

await app.register(Helmet, {
  global: true,
  enableCSPNonces: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", 'http://127.0.0.1:3000', 'http://localhost:3000', 'ws://localhost:24678/'],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      blockAllMixedContent: []
    }
  }
})
await app.register(Compress)

await app.register(remixFastify, {
  getLoadContext: async (request, reply) => ({
    scriptNonce: reply.cspNonce.script,
    styleNonce: reply.cspNonce.style,
    logger
  })
})

const { host, port } = Config.server
const address = await app.listen({ port, host })
logger.info(`app ready: ${address}`)
