import * as Pino from 'pino'
import MemJs from 'memjs'
import { knexSnakeCaseMappers } from 'objection'
import { Knex } from 'knex'
import PG from 'pg'

export const csp = {
  global: true,
  enableCSPNonces: true,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        "'self'",
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'ws://localhost:24678/',
        'http://localhost:24678/'
      ],
      connectSrc: [
        "'self'",
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'ws://localhost:24678/',
        'http://localhost:24678/'
      ],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'http://127.0.0.1:3000',
        'http://localhost:3000',
        'ws://localhost:24678/',
        'http://localhost:24678/'
      ],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      blockAllMixedContent: []
    }
  }
}

export const logger: Pino.LoggerOptions = {
  name: process.env.APP_NAME ?? 'holmok-app',
  level: process.env.LOG_LEVEL ?? 'info'
}

export const knex: Knex.Config = {
  ...knexSnakeCaseMappers(),
  client: 'postgres',
  connection: {
    connectionString: process.env.DATABASE_URL ?? '',
    ssl: false
  },
  pool: {
    min: 1,
    max: 7,
    afterCreate: function (
      conn: PG.PoolClient,
      done: (err: Error | undefined, conn: PG.PoolClient) => void
    ) {
      const schema = process.env.PG_SCHEMA ?? 'holmok_remix'
      conn.query(
        `SET search_path TO "${schema}", public;`,
        (err: Error | undefined) => {
          done(err, conn)
        }
      )
    }
  }
}

export const server = {
  host: process.env.HOST != null ? process.env.HOST : '127.0.0.1',
  port: process.env.PORT != null ? Number(process.env.PORT) : 3000
}

export const memcached: { servers: string; options: MemJs.ServerOptions } = {
  servers:
    process.env.MEMCACHIER_SERVERS != null
      ? process.env.MEMCACHIER_SERVERS
      : 'localhost:11211',
  options: {
    timeout: 1,
    conntimeout: 1,
    keepAlive: true
  }
}
