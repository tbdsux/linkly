import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { ID } from "appwrite";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "~/auth/AuthProvider";
import { getPublicEnv } from "~/components/public-env";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { databases } from "~/lib/appwrite";
import { useDashboard } from "~/providers/DashboardProvider";
import { useIsOpen } from "~/shared-hooks/useIsOpen";
import { LinksStore } from "~/typings/collections";
import { UrlError, UrlMetadata } from "~/typings/metadata";

const linkForm = z.object({
  urlTitle: z.string(),
  urlDescription: z.string().optional(),
  category: z.string().optional(),
});

type LinkForm = z.infer<typeof linkForm>;

const getNonEmptyString = (str: (string | undefined)[]) => {
  // return the first non-empty string (yes haha)
  for (const item of str) {
    if (item) return item;
  }

  return "";
};

export default function CreateLinkForm(props: {
  data: UrlMetadata | UrlError;
}) {
  const { user } = useAuth();
  const { categoriesQuery } = useDashboard();

  const queryClient = useQueryClient();

  const { isOpen, setIsOpen } = useIsOpen();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<LinkForm>({
    resolver: zodResolver(linkForm),
    defaultValues: {
      urlTitle: "error" in props.data ? "" : props.data.title,
      urlDescription: "error" in props.data ? "" : props.data.description,
      category: "",
    },
  });

  const onSubmit = async (data: LinkForm) => {
    if (data.urlTitle === "") {
      return;
    }

    if (!user) return;

    setIsProcessing(true);
    const process = toast.loading("Creating link...");

    const urlData = "error" in props.data ? null : props.data;

    try {
      const linkData: Partial<LinksStore> = {
        ownerId: user.$id,
        urlLink:
          "error" in props.data ? props.data.url : props.data.requested_url,
        urlTitle: data.urlTitle,
        urlDescription: data.urlDescription,
        urlFavicon: urlData?.favicon ?? "",
        urlLogo: getNonEmptyString([urlData?.logo, urlData?.image]),
        category: data.category,
      };

      await databases.createDocument(
        getPublicEnv("APPWRITE_DATABASE_ID"),
        getPublicEnv("APPWRITE_COLLECTION_STORE"),
        ID.unique(),
        linkData
      );

      // Invalidate the links query to refetch the data
      await queryClient.invalidateQueries({
        queryKey: ["dashboard-links"],
      });

      toast.success("Link created successfully", { id: process });
      setIsProcessing(false);
      setIsOpen(false);
    } catch (err) {
      toast.error(`Failed to create link: ${(err as Error).message}`, {
        id: process,
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button>Create Link</Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Create Link</DialogTitle>
          <DialogDescription>
            Setup your link, add a title and description
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {"error" in props.data ? null : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg inline-flex space-x-2">
                  {props.data.favicon ? (
                    <img
                      src={new URL(
                        props.data.favicon,
                        props.data.url
                      ).toString()}
                      alt="favicon"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : null}

                  <span>{props.data.title}</span>
                </CardTitle>
                <CardDescription>{props.data.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid">
                <div>
                  <a
                    href={props.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm break-all"
                  >
                    {props.data.url}
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="urlTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Link title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urlDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Link description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>

                    <Select
                      defaultValue={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* @ts-expect-error This works lol */}
                        <SelectItem value={null}>None</SelectItem>
                        {categoriesQuery.data?.documents.map((item) => (
                          <SelectItem key={item.$id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Button disabled={isProcessing} type="submit">
                  {isProcessing ? "Creating..." : "Create Link"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
