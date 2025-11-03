import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createAdminClient } from '@/lib/appwrite'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { OAuthProvider } from 'node-appwrite'

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Login - LinkStore',
      },
    ],
  }),
})

export const signUpWithGithubFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const { account } = createAdminClient()

    const request = getRequest()
    const origin = request.headers.get('origin')

    const redirectUrl = await account.createOAuth2Token({
      provider: OAuthProvider.Github,
      success: `${origin}/login/oauth`,
      failure: `${origin}/login`,
    })

    throw redirect({ href: redirectUrl })
  },
)

function RouteComponent() {
  const signUpWithGithub = useServerFn(signUpWithGithubFn)

  return (
    <div className="flex items-center justify-center">
      <Card className="w-2xl">
        <CardHeader>
          <CardTitle>Authenticate to Continue</CardTitle>
          <CardDescription>
            Please log in to access your link management dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col space-y-2">
            <Button
              onClick={() => signUpWithGithub()}
              className="cursor-pointer"
            >
              Login with Github
            </Button>
            <Button className="cursor-pointer">Login with Google</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
