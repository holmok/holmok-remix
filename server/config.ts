import * as Pino from 'pino'

export const logger: Pino.LoggerOptions = {
  name: process.env.APP_NAME ?? 'holmok-app',
  level: process.env.LOG_LEVEL ?? 'info'
}

export const server = {
  host: process.env.HOST != null ? process.env.HOST : '127.0.0.1',
  port: process.env.PORT != null ? Number(process.env.PORT) : 3000
}
