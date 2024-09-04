import Pino from 'pino'
import MemJs from 'memjs'
import * as Config from './config.js'

export default class Cacher {
  private readonly client
  constructor(private readonly log: Pino.Logger) {
    log.info('Creating cacher')
    log.debug(
      { servers: Config.memcached.servers, options: Config.memcached.options },
      'Memcached configuration'
    )
    this.client = MemJs.Client.create(
      Config.memcached.servers,
      Config.memcached.options
    )
  }

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const { value } = await this.client.get(key)
    if (value != null) {
      return JSON.parse(value.toString('utf-8'))
    }
    const result = await fetcher()
    await this.client.set(key, Buffer.from(JSON.stringify(result), 'utf-8'), {
      expires: ttl ?? 60 * 60
    })
    return result
  }

  async delete(key: string): Promise<void> {
    await this.client.delete(key)
  }

  async flush(): Promise<void> {
    await this.client.flush()
  }

  shutdown(): void {
    this.client.quit()
  }
}
