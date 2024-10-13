import { useNavigate } from "@remix-run/react";
import { ReactNode, useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function ProtectRoute(props: {
  children: ReactNode;
  redirectTo: string;
}) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [navigate, user]);

  if (isLoading) return <></>;

  return <>{props.children}</>;
}

export function AuthRoute(props: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate, user]);

  if (isLoading) return <></>;

  return <>{props.children}</>;
}
