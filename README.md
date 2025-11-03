![Linkly Logo](./src/assets/logo.png)

# linkly

Manage your links like a pro

A simple service to save, store, bookmark your favorite links

![App Screenshot](./screenshot.png)

## Development

### Environment Variables

```sh
SECRET_KEY=

# appwrite database
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_COLLECTION_STORE=create-a-collection-store
APPWRITE_COLLECTION_CATEGORIES=create-a-collection-categories
APPWRITE_DOMAIN=appwrite-domain
APPWRITE_API_KEY=

SCRAPER_API= # your hosted instance of https://github.com/tbdsux/cf-worker-scraper

# umami analytics, if you have one
ANALYTICS_FILE=
ANALYTICS_WEBSITE_ID=
```

### Stack

- Remix (React)
- ShadCN
- Tailwind
- AppWrite (Database and Auth)

> [!INFO]
> While this app is built with Remix, all of the auth setup and the forms are implemented in the client side, Remix mainly handles the routing only.

##

&copy; 2024 | tbdsux
