import {
  redirect,
} from "next/navigation";

import {
  auth,
  type CairosAuthRole,
} from "@/auth";

import OAuthSessionBridge from "./OAuthSessionBridge";

export const dynamic =
  "force-dynamic";

type CairosSessionUser = {
  id?:
    string;

  name?:
    string | null;

  email?:
    string | null;

  image?:
    string | null;

  role?:
    CairosAuthRole;
};

export default async function AuthSyncPage() {
  const session =
    await auth();

  if (
    !session?.user
      ?.email
  ) {
    redirect(
      "/login"
    );
  }

  const sessionUser =
    session.user as
      CairosSessionUser;

  const user = {
    id:
      sessionUser.id ||
      session.user
        .email,

    name:
      session.user.name ||
      session.user.email,

    email:
      session.user.email,

    image:
      session.user.image ??
      null,

    role:
      sessionUser.role ??
      "OPERATOR" as const,
  };

  return (
    <OAuthSessionBridge
      user={
        user
      }
    />
  );
}