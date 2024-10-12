// Add all of your providers here

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import AuthProvider from "~/auth/AuthProvider";

const queryClient = new QueryClient();

export default function WrapperProviders(props: { children: ReactNode }) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{props.children}</AuthProvider>
      </QueryClientProvider>
    </>
  );
}
