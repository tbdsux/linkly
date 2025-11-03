import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import AuthProvider from '@/components/auth-provider'
import Header from '@/components/header'
import NotFoundError from '@/components/not-found-error'
import { getLoggedInUserFn } from '@/lib/auth'
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
    const userSession = await getLoggedInUserFn()
    return userSession
  },
  loader: async ({ context }) => {
    return {
      avatar: context.avatar,
      user: context.user,
    }
  },
  notFoundComponent: () => <NotFoundError />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const userSession = Route.useLoaderData()

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider
          user={userSession ? userSession.user : null}
          avatar={userSession ? userSession.avatar : null}
        >
          <main className="flex flex-col min-h-screen md:w-5/6 lg:w-4/5 xl:w-3/4 mx-auto">
            <Header />
            {children}
          </main>
        </AuthProvider>
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
        <Scripts />
      </body>
    </html>
  )
}
