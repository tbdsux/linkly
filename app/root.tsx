import type { LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import PublicEnv from "./components/public-env";
import { Toaster } from "./components/ui/sonner";
import DefaultLayout from "./layouts/default";
import WrapperProviders from "./providers/wrapper";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {
    rel: "manifest",
    href: "/site.webmanifest",
  },
];

export async function loader() {
  return json({
    ENV: {
      APPWRITE_DATABASE_ID: process.env.APPWRITE_DATABASE_ID ?? "",
      APPWRITE_COLLECTION_STORE: process.env.APPWRITE_COLLECTION_STORE ?? "",
      APPWRITE_COLLECTION_CATEGORIES:
        process.env.APPWRITE_COLLECTION_CATEGORIES ?? "",
      APPWRITE_DOMAIN: process.env.APPWRITE_DOMAIN ?? "",
      SCRAPER_API: process.env.SCRAPER_API ?? "",
      ANALYTICS_FILE: process.env.ANALYTICS_FILE ?? "",
      ANALYTICS_WEBSITE_ID: process.env.ANALYTICS_WEBSITE_ID ?? "",
    },
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <WrapperProviders>
          <DefaultLayout>{children}</DefaultLayout>

          <Toaster />
        </WrapperProviders>
        <ScrollRestoration />
        <PublicEnv {...data.ENV} />
        <Scripts />

        {/* Umami analytics script  */}
        {data.ENV.ANALYTICS_FILE && data.ENV.ANALYTICS_WEBSITE_ID ? (
          <script
            defer
            src={data.ENV.ANALYTICS_FILE}
            data-website-id={data.ENV.ANALYTICS_WEBSITE_ID}
          />
        ) : null}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
