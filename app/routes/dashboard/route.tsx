import { MetaFunction } from "@remix-run/react";
import CategoryNew from "~/modules/dashboard/CategoryNew";
import DashboardLinksList from "~/modules/dashboard/LinksList";
import NewLink from "~/modules/dashboard/NewLink";
import DashboardProvider from "~/providers/DashboardProvider";

export const meta: MetaFunction = () => {
  return [{ title: "Dashboard | LinkStore" }];
};

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <main className="flex-1 lg:w-3/4 mx-auto ">
        <div className="flex justify-between items-center space-x-4 w-full">
          <h3 className="font-bold text-lg">All Links</h3>

          <div className="inline-flex items-center space-x-2">
            <NewLink />
            <CategoryNew />
          </div>
        </div>

        <hr className="my-4" />

        <DashboardLinksList />
      </main>
    </DashboardProvider>
  );
}
