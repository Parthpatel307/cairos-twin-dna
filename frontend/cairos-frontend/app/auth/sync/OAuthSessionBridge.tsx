"use client";

import {
  useEffect,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  AUTH_EVENT,
  type AuthRole,
  type AuthUser,
} from "@/lib/auth";

const SESSION_KEY =
  "cairos_auth_session_v2";

const OLD_SESSION_KEY =
  "cairos_auth_user_v1";

const LEGACY_KEY =
  "cairos_demo_user";

type OAuthUser = {
  id: string;

  name: string;

  email: string;

  image:
    string | null;

  role:
    AuthRole;
};

export default function OAuthSessionBridge({
  user,
}: {
  user:
    OAuthUser;
}) {
  const router =
    useRouter();

  useEffect(() => {
    const now =
      new Date()
        .toISOString();

    let createdAt =
      now;

    try {
      const existingRaw =
        window
          .localStorage
          .getItem(
            SESSION_KEY
          );

      if (
        existingRaw
      ) {
        const existing =
          JSON.parse(
            existingRaw
          ) as Partial<AuthUser>;

        if (
          existing.email
            ?.toLowerCase() ===
            user.email
              .toLowerCase() &&
          existing.createdAt
        ) {
          createdAt =
            existing.createdAt;
        }
      }
    } catch {
      createdAt =
        now;
    }

    const authUser:
      AuthUser = {
        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        organization:
          "CAIROS TWIN DNA",

        title:
          `${user.role} / Google`,

        createdAt,

        signedInAt:
          now,
      };

    window
      .localStorage
      .setItem(
        SESSION_KEY,
        JSON.stringify(
          authUser
        )
      );

    window
      .localStorage
      .removeItem(
        OLD_SESSION_KEY
      );

    window
      .localStorage
      .removeItem(
        LEGACY_KEY
      );

    window.dispatchEvent(
      new Event(
        AUTH_EVENT
      )
    );

    router.replace(
      "/"
    );

    router.refresh();
  }, [
    router,
    user.email,
    user.id,
    user.name,
    user.role,
  ]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050705] px-6 text-[#efefe5]">
      <div className="w-full max-w-[520px] rounded-[24px] border border-white/[0.08] bg-[#081109] p-8 text-center">
        <div className="mx-auto h-2 w-2 animate-pulse rounded-full bg-[#cce849]" />

        <p className="mt-6 text-[7px] font-black tracking-[0.16em] text-[#cce849]">
          GOOGLE IDENTITY VERIFIED
        </p>

        <h1 className="mt-4 text-3xl font-black tracking-[-0.04em]">
          ENTERING CAIROS
        </h1>

        <p className="mt-4 text-[10px] leading-6 text-white/35">
          Establishing the local interface identity from the
          authenticated Google session.
        </p>
      </div>
    </main>
  );
}