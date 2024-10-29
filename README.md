![Linkly Logo](./public/logo.png)

# linkly

Manage your links like a pro

A simple service to save, store, bookmark your favorite links

![App](https://jam.dev/cdn-cgi/image/width=1600,quality=100,dpr=1/https://cdn-jam-screenshots.jam.dev/257a4a41a77a2ac3d7103b0d99dcf2d1/screenshot/c6067087-3541-4c49-8175-60f8cee4da08.png)

## Development

### Environment Variables

```sh
# appwrite database
APPWRITE_DATABASE_ID=your-database-id
APPWRITE_COLLECTION_STORE=create-a-collection-store
APPWRITE_COLLECTION_CATEGORIES=create-a-collection-categories
APPWRITE_DOMAIN=appwrite-domain # this is to avoid browser issue with 3rd party cookies

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
