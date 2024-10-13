import { Link, useLocation, useNavigate } from "@remix-run/react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOutIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { account, avatars } from "~/lib/appwrite";
import { useAuth } from "./AuthProvider";

export default function AuthHeaderMenu() {
  const { user, isLoading } = useAuth();

  const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) return <></>;

  if (!user) {
    return (
      <>
        <Button asChild>
          <Link to="/login">Account</Link>
        </Button>
      </>
    );
  }

  if (location.pathname === "/dashboard") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            className="inline-flex items-center space-x-2"
          >
            <img
              src={avatars.getInitials(user.name)}
              alt={user.name}
              height={25}
              width={25}
              className="rounded-full"
            />

            <span>{user.name}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem
            onSelect={async () => {
              await account.deleteSession("current");
              await queryClient.resetQueries();

              navigate("/login");
            }}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button asChild>
        <Link to="/dashboard">Dashboard</Link>
      </Button>
    </>
  );
}
