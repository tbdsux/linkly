import { LoaderFunctionArgs, json } from "@remix-run/node";
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { OAuthProvider } from "appwrite";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { account } from "~/lib/appwrite";

export const meta: MetaFunction = () => {
  return [{ title: "Login | LinkStore" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  return json({ origin: url.origin, pathname: url.pathname });
}

export default function LoginPage() {
  const data = useLoaderData<typeof loader>();

  const loginWithGithub = async () => {
    return await account.createOAuth2Session(
      OAuthProvider.Github,
      new URL("/dashboard", data.origin).toString(),
      new URL("/login", data.origin).toString()
    );
  };

  return (
    <main className="flex-1">
      <div className="max-w-3xl w-full mx-auto px-4 md:px-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Login using your social media accounts below
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4">
              <Button onClick={loginWithGithub}>Login with Github</Button>

              <Button disabled>Login with Google</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
