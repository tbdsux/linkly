import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import '@fontsource-variable/public-sans'
import appCss from '../styles.css?url'

import AuthProvider from '@/components/auth-provider'
import Header from '@/components/header'
import NotFoundError from '@/components/not-found-error'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { getThemeServerFn } from '@/lib/theme'
import { getUserSessionFn } from '@/server/session'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  beforeLoad: async () => {
    const session = await getUserSessionFn()

    return {
      session,
    }
  },
  loader: async ({ context }) => {
    const theme = await getThemeServerFn()

    return {
      user: context.session?.user,
      theme,
    }
  },
  notFoundComponent: () => <NotFoundError />,
  pendingMs: 0,
  pendingMinMs: 0,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const userSession = Route.useLoaderData()

  return (
    <html className={userSession?.theme ?? 'light'} lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider theme={userSession?.theme ?? 'light'}>
          <AuthProvider user={userSession.user ? userSession.user : null}>
            <main className="flex flex-col min-h-screen md:w-5/6 lg:w-4/5 xl:w-3/4 mx-auto">
              <Header />
              {children}
            </main>
          </AuthProvider>
          <Toaster />

          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
