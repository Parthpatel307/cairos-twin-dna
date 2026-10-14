import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export type CairosAuthRole =
  | "OPERATOR"
  | "REVIEWER"
  | "ADMIN";

function normalizeEmail(
  value:
    string | null | undefined
) {
  return (
    value
      ?.trim()
      .toLowerCase() ??
    ""
  );
}

function emailSet(
  raw:
    string | undefined
) {
  return new Set(
    (
      raw ??
      ""
    )
      .split(",")
      .map(
        (
          value
        ) =>
          normalizeEmail(
            value
          )
      )
      .filter(
        Boolean
      )
  );
}

const ADMIN_EMAILS =
  emailSet(
    process.env
      .CAIROS_ADMIN_EMAILS
  );

const REVIEWER_EMAILS =
  emailSet(
    process.env
      .CAIROS_REVIEWER_EMAILS
  );

function resolveRole(
  email:
    string | null | undefined
): CairosAuthRole {
  const normalized =
    normalizeEmail(
      email
    );

  if (
    normalized &&
    ADMIN_EMAILS.has(
      normalized
    )
  ) {
    return "ADMIN";
  }

  if (
    normalized &&
    REVIEWER_EMAILS.has(
      normalized
    )
  ) {
    return "REVIEWER";
  }

  return "OPERATOR";
}

function validRole(
  value:
    unknown
): CairosAuthRole {
  if (
    value ===
      "ADMIN" ||
    value ===
      "REVIEWER" ||
    value ===
      "OPERATOR"
  ) {
    return value;
  }

  return "OPERATOR";
}

export const {
  handlers,
  auth,
  signIn,
  signOut,
} =
  NextAuth({
    trustHost:
      true,

    session: {
      strategy:
        "jwt",
    },

    pages: {
      signIn:
        "/login",
    },

    providers: [
      Google,
    ],

    callbacks: {
      async signIn({
        account,
        profile,
      }) {
        if (
          account?.provider !==
          "google"
        ) {
          return false;
        }

        const googleProfile =
          profile as
            | {
                email?:
                  string;

                email_verified?:
                  boolean;
              }
            | undefined;

        if (
          !googleProfile
            ?.email
        ) {
          return false;
        }

        if (
          googleProfile
            .email_verified ===
          false
        ) {
          return false;
        }

        return true;
      },

      async jwt({
        token,
        profile,
        account,
      }) {
        const profileEmail =
          typeof profile
            ?.email ===
          "string"
            ? profile.email
            : null;

        if (
          account?.provider ===
          "google"
        ) {
          token.cairosRole =
            resolveRole(
              profileEmail ??
                token.email
            );
        } else if (
          !token.cairosRole
        ) {
          token.cairosRole =
            resolveRole(
              token.email
            );
        }

        return token;
      },

      async session({
        session,
        token,
      }) {
        if (
          session.user
        ) {
          const cairosUser =
            session.user as
              typeof session.user & {
                id?:
                  string;

                role?:
                  CairosAuthRole;
              };

          cairosUser.id =
            token.sub ??
            token.email ??
            "";

          cairosUser.role =
            validRole(
              token.cairosRole
            );
        }

        return session;
      },
    },
  });