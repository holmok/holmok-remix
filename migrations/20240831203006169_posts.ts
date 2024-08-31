import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up (pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('posts', {
    id: 'id',
    title: { type: 'text', notNull: true },
    stub: { type: 'text', notNull: true },
    content: { type: 'text', notNull: true },
    categories: { type: 'text[]', notNull: true, default: '{}' },
    live: { type: 'boolean', notNull: true, default: true },
    archived: { type: 'boolean', notNull: true, default: false },
    published: { type: 'timestamp', notNull: false },
    created: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },
    updated: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  })

  pgm.createIndex('posts', 'stub', { unique: true })
  pgm.createIndex('posts', 'categories')
  pgm.createIndex('posts', 'live')
  pgm.createIndex('posts', 'archived')
  pgm.createIndex('posts', 'published')
}

export async function down (pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex('posts', 'stub', { unique: true })
  pgm.dropIndex('posts', 'categories')
  pgm.dropIndex('posts', 'live')
  pgm.dropIndex('posts', 'archived')
  pgm.dropIndex('posts', 'published')

  pgm.dropTable('posts')
}
