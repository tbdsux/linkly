import { useQuery } from "@tanstack/react-query";
import { Models } from "appwrite";
import { createContext, ReactNode, useContext } from "react";
import { account } from "~/lib/appwrite";

const AuthContext = createContext<{
  user?: Models.User<Models.Preferences>;
  isLoading: boolean;
}>({
  isLoading: false,
});

export default function AuthProvider(props: { children: ReactNode }) {
  const { data, isPending } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const user = await account.get();

      return user;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <AuthContext.Provider value={{ user: data, isLoading: isPending }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
