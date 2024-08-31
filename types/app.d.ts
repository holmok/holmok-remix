import '@remix-run/server-runtime'
import * as Pino from 'pino'
import Cacher from './cacher.js'
import Knex from 'knex'

declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    scriptNonce: string
    styleNonce: string
    logger: Pino.Logger
    cache: typeof Cacher
    db: Knex
  }
}
