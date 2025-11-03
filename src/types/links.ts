import { Models } from 'node-appwrite'

export interface Category extends Models.Row {
  name: string // unique
  ownerId: string
}

export interface Links extends Models.Row {
  ownerId: string
  isFavorite?: boolean
  urlLink: string
  urlTitle: string
  urlDescription?: string
  urlLogo?: string
  urlFavicon: string // should be visible or set
  category?: string // this is by category name not id
}
