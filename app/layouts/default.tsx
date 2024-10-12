import { Link } from "@remix-run/react";
import { LinkIcon } from "lucide-react";
import { ReactNode, Suspense } from "react";
import AuthHeaderMenu from "~/auth/AuthHeaderMenu";

export default function DefaultLayout(props: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen md:w-5/6 lg:w-4/5 xl:w-3/4 mx-auto">
      <header className="px-4 lg:px-6 py-6 flex items-center">
        <Link className="flex items-center justify-center" to="#">
          <LinkIcon className="h-6 w-6" />
          <span className="sr-only">LinkStore</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Suspense fallback={<></>}>
            <AuthHeaderMenu />
          </Suspense>
        </nav>
      </header>

      <>{props.children}</>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 LinkMaster Inc. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
