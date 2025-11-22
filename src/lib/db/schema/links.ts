import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const link = pgTable('link', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  urlLink: text('url_link').notNull(),
  urlTitle: text('url_title').notNull(),
  urlDescription: text('url_description'),
  urlLogo: text('url_logo'),
  urlFavicon: text('url_favicon').notNull(),
  category: text('category'),
  slug: text('slug').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const category = pgTable('category', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  slug: text('slug').unique(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})
