import { Loading } from "~/components/Loader";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useDashboard } from "~/providers/DashboardProvider";
import DeleteLink from "./DeleteLink";
import EditLink from "./EditLink";

export default function DashboardLinksList() {
  const { linksQuery } = useDashboard();

  return (
    <div>
      {linksQuery.isLoading && (
        <div>
          <Loading />
        </div>
      )}
      {linksQuery.isError && (
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="text-lg">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Failed to load links. Please try again.
            </CardDescription>
          </CardContent>
        </Card>
      )}
      {linksQuery.isSuccess && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {linksQuery.data?.documents.length === 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">No links found</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    You don{"'"}t have any links saved. Click the `New` button
                    to save a new link.
                  </CardDescription>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {linksQuery.data?.documents.map((link) => (
                <Card key={link.$id} className="group relative">
                  <div className="absolute top-2 right-2 hidden group-hover:block group-focus:block">
                    <div className="space-x-2">
                      <EditLink data={link} />

                      <DeleteLink linkTitle={link.urlTitle} id={link.$id} />
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-lg inline-flex space-x-2">
                      {link.urlFavicon ? (
                        <img
                          src={new URL(
                            link.urlFavicon,
                            link.urlLink
                          ).toString()}
                          alt="favicon"
                          className="h-6 w-6 rounded-full"
                        />
                      ) : null}

                      <span className="truncate">{link.urlTitle}</span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {link.urlDescription}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div>
                      <a
                        href={link.urlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-sm break-all"
                      >
                        {link.urlLink}
                      </a>
                    </div>

                    <div className="">
                      {link.category ? (
                        <Badge>{link.category}</Badge>
                      ) : (
                        <Badge variant={"outline"}>Uncategorized</Badge>
                      )}

                      {link.$updatedAt > link.$createdAt ? (
                        <p className="text-right mt-2">
                          <small className="text-muted-foreground">
                            Updated:{" "}
                            <strong>
                              {new Date(link.$createdAt).toLocaleString()}
                            </strong>
                          </small>
                        </p>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
