declare global {
  interface Window {
    ENV: EnvProps;
  }
}

type EnvProps = {
  APPWRITE_DATABASE_ID: string;
  APPWRITE_COLLECTION_STORE: string;
  APPWRITE_COLLECTION_CATEGORIES: string;
  SCRAPER_API: string;
};

export default function PublicEnv(props: EnvProps) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.ENV = ${JSON.stringify(props)}`,
      }}
    />
  );
}

export function getPublicEnv<T extends keyof EnvProps>(key: T): EnvProps[T] {
  if (typeof window !== "undefined" && !window.ENV) {
    throw new Error(
      `Missing the <PublicEnv /> component at the root of your app.`
    );
  }

  return typeof window === "undefined" ? "" : window.ENV[key];
}
