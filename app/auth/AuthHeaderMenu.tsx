import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { useAuth } from "./AuthProvider";

export default function AuthHeaderMenu() {
  const { user, isLoading } = useAuth();

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

  return (
    <>
      <Button asChild>
        <Link to="/dashboard">Dashboard</Link>
      </Button>
    </>
  );
}
