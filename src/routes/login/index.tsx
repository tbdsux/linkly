import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { GithubIcon } from 'lucide-react'

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

function RouteComponent() {
  const signInWithGithub = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/dashboard',
    })
  }

  return (
    <div className="flex items-center justify-center space-y-4">
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
              onClick={() => signInWithGithub()}
              className="cursor-pointer"
            >
              <GithubIcon />
              Login with Github
            </Button>

            {/* <Button
              onClick={() => signInWithGoogle()}
              className="cursor-pointer"
            >
              <GlobeIcon />
              Login with Google
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
