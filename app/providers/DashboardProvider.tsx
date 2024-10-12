import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Models, Query } from "appwrite";
import { createContext, ReactNode, useContext } from "react";
import { useAuth } from "~/auth/AuthProvider";
import { getPublicEnv } from "~/components/public-env";
import { databases } from "~/lib/appwrite";
import { Category, LinksStore } from "~/typings/collections";

const DashboardContext = createContext<{
  linksQuery: UseQueryResult<Models.DocumentList<LinksStore> | null, Error>;
  categoriesQuery: UseQueryResult<Models.DocumentList<Category> | null, Error>;
}>({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  linksQuery: {} as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoriesQuery: {} as any,
});

export default function DashboardProvider(props: { children: ReactNode }) {
  const { user } = useAuth();

  const linksQuery = useQuery({
    queryKey: ["dashboard-links"],
    queryFn: async () => {
      if (!user) {
        return null;
      }

      return await databases.listDocuments<LinksStore>(
        getPublicEnv("APPWRITE_DATABASE_ID"),
        getPublicEnv("APPWRITE_COLLECTION_STORE"),
        [Query.equal("ownerId", user?.$id), Query.orderDesc("$updatedAt")]
      );
    },
    enabled: !!user,
  });

  const categoriesQuery = useQuery({
    queryKey: ["dashboard-categories"],
    queryFn: async () => {
      if (!user) {
        return null;
      }

      return await databases.listDocuments<Category>(
        getPublicEnv("APPWRITE_DATABASE_ID"),
        getPublicEnv("APPWRITE_COLLECTION_CATEGORIES"),
        [Query.equal("ownerId", user?.$id), Query.orderDesc("$updatedAt")]
      );
    },
    enabled: !!user,
  });

  return (
    <DashboardContext.Provider
      value={{
        linksQuery,
        categoriesQuery,
      }}
    >
      {props.children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }

  return context;
};
