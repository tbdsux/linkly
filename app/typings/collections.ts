import { Models } from "appwrite";

export interface Category extends Models.Document {
  name: string; // unique
  ownerId: string;
}

export interface LinksStore extends Models.Document {
  ownerId: string;
  isFavorite?: boolean;
  urlLink: string;
  urlTitle: string;
  urlDescription?: string;
  urlLogo?: string;
  urlFavicon: string; // should be visible or set
  category?: string; // this is by category name not id
}
