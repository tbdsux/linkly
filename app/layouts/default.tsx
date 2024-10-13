import { Link } from "@remix-run/react";
import { LinkIcon } from "lucide-react";
import { ReactNode } from "react";
import AuthHeaderMenu from "~/auth/AuthHeaderMenu";

export default function DefaultLayout(props: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen md:w-5/6 lg:w-4/5 xl:w-3/4 mx-auto">
      <header className="px-4 lg:px-6 py-6 h-24 flex items-center">
        <Link className="flex items-center justify-center space-x-2" to="/">
          <LinkIcon className="h-6 w-6" />
          <strong className="font-bold text-lg">Linkly</strong>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <AuthHeaderMenu />
        </nav>
      </header>

      <>{props.children}</>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; 2024 Linkly | TBDH.DEV - All rights reserved
        </p>
      </footer>
    </div>
  );
}
