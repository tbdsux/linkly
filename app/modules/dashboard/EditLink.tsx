import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { EditIcon } from "lucide-react";
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

const linkForm = z.object({
  urlTitle: z.string(),
  urlDescription: z.string().optional(),
  category: z.string().optional(),
});

type LinkForm = z.infer<typeof linkForm>;

export default function EditLink(props: { data: LinksStore }) {
  const { user } = useAuth();
  const { categoriesQuery } = useDashboard();

  const queryClient = useQueryClient();

  const { isOpen, setIsOpen } = useIsOpen();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<LinkForm>({
    resolver: zodResolver(linkForm),
    defaultValues: {
      urlTitle: props.data.urlTitle ?? "",
      urlDescription: props.data.urlDescription ?? "",
      category: props.data.category ?? "",
    },
  });

  const onSubmit = async (data: LinkForm) => {
    if (data.urlTitle === "") {
      return;
    }

    if (!user) return;

    setIsProcessing(true);
    const process = toast.loading("Creating link...");

    try {
      const updateLinkData: Partial<LinksStore> = {
        urlTitle: data.urlTitle,
        urlDescription: data.urlDescription,
        category: data.category,
      };

      await databases.updateDocument(
        getPublicEnv("APPWRITE_DATABASE_ID"),
        getPublicEnv("APPWRITE_COLLECTION_STORE"),
        props.data.$id,
        updateLinkData
      );

      // Invalidate the links query to refetch the data
      await queryClient.invalidateQueries({
        queryKey: ["dashboard-links"],
      });

      toast.success("Link updated successfully", { id: process });
      setIsProcessing(false);
      setIsOpen(false);
    } catch (err) {
      toast.error(`Failed to update link: ${(err as Error).message}`, {
        id: process,
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="text-sm h-auto py-1 space-x-1 px-2">
          <EditIcon className="h-4 w-4" />
          <span>Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => isProcessing && e.preventDefault()}
        className="max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Update Link</DialogTitle>
          <DialogDescription>Update the link details below</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg inline-flex space-x-2">
                {props.data.urlFavicon ? (
                  <img
                    src={new URL(
                      props.data.urlFavicon,
                      props.data.urlLink
                    ).toString()}
                    alt="favicon"
                    className="h-6 w-6 rounded-full"
                  />
                ) : null}

                <span>{props.data.urlTitle}</span>
              </CardTitle>
              <CardDescription>{props.data.urlDescription}</CardDescription>
            </CardHeader>
            <CardContent className="grid">
              <div>
                <a
                  href={props.data.urlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm"
                >
                  {props.data.urlLink}
                </a>
              </div>
            </CardContent>
          </Card>

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
                  {isProcessing ? "Updating..." : "Update Link"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
