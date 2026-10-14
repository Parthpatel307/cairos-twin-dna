"use client";

export type AuthRole =
  | "OPERATOR"
  | "REVIEWER"
  | "ADMIN";

export interface AuthUser {
  id: string;

  name: string;

  email: string;

  role: AuthRole;

  organization: string;

  title: string;

  createdAt: string;

  signedInAt: string;
}

interface StoredAccount {
  id: string;

  name: string;

  email: string;

  role: AuthRole;

  organization: string;

  title: string;

  createdAt: string;

  passwordHash: string;
}

export interface CreateAccountInput {
  name: string;

  email: string;

  password: string;

  role: AuthRole;

  organization: string;

  title: string;
}

export interface SignInInput {
  email: string;

  password: string;
}

export interface AuthResult {
  ok: boolean;

  message: string;

  user?: AuthUser;
}

const ACCOUNTS_KEY =
  "cairos_accounts_v1";

const SESSION_KEY =
  "cairos_auth_session_v2";

const OLD_SESSION_KEY =
  "cairos_auth_user_v1";

const LEGACY_KEY =
  "cairos_demo_user";

/*
  Important:
  CairosIntro uses this exact key.
*/

const INTRO_KEY =
  "cairos_intro_seen_v3";

export const AUTH_EVENT =
  "cairos-auth-changed";

function emitAuthChanged() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  window.dispatchEvent(
    new Event(
      AUTH_EVENT
    )
  );
}

function normalizeEmail(
  email: string
) {
  return email
    .trim()
    .toLowerCase();
}

function readAccounts():
  StoredAccount[] {
  if (
    typeof window ===
    "undefined"
  ) {
    return [];
  }

  const raw =
    localStorage.getItem(
      ACCOUNTS_KEY
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(
        raw
      );

    return Array.isArray(
      parsed
    )
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function writeAccounts(
  accounts: StoredAccount[]
) {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.setItem(
    ACCOUNTS_KEY,
    JSON.stringify(
      accounts
    )
  );
}

async function hashPassword(
  password: string
) {
  const encoded =
    new TextEncoder().encode(
      password
    );

  const digest =
    await crypto.subtle.digest(
      "SHA-256",
      encoded
    );

  return Array.from(
    new Uint8Array(
      digest
    )
  )
    .map(
      (
        byte
      ) =>
        byte
          .toString(
            16
          )
          .padStart(
            2,
            "0"
          )
    )
    .join("");
}

function createSession(
  account: StoredAccount
): AuthUser {
  const user:
    AuthUser = {
      id:
        account.id,

      name:
        account.name,

      email:
        account.email,

      role:
        account.role,

      organization:
        account.organization,

      title:
        account.title,

      createdAt:
        account.createdAt,

      signedInAt:
        new Date().toISOString(),
    };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(
      user
    )
  );

  localStorage.removeItem(
    OLD_SESSION_KEY
  );

  localStorage.removeItem(
    LEGACY_KEY
  );

  emitAuthChanged();

  return user;
}

export function getCurrentUser():
  AuthUser | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  const raw =
    localStorage.getItem(
      SESSION_KEY
    );

  if (!raw) {
    return null;
  }

  try {
    const user =
      JSON.parse(
        raw
      ) as AuthUser;

    if (
      !user.id ||
      !user.email ||
      !user.name ||
      !user.role
    ) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function createLocalAccount(
  input: CreateAccountInput
): Promise<AuthResult> {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      ok: false,

      message:
        "Account creation is only available in the browser.",
    };
  }

  const name =
    input.name.trim();

  const email =
    normalizeEmail(
      input.email
    );

  const organization =
    input.organization.trim();

  const title =
    input.title.trim();

  if (
    name.length < 2
  ) {
    return {
      ok: false,

      message:
        "Enter your full name.",
    };
  }

  if (
    !email.includes(
      "@"
    ) ||
    !email.includes(
      "."
    )
  ) {
    return {
      ok: false,

      message:
        "Enter a valid email address.",
    };
  }

  if (
    input.password.length <
    6
  ) {
    return {
      ok: false,

      message:
        "Password must contain at least 6 characters.",
    };
  }

  if (
    !organization
  ) {
    return {
      ok: false,

      message:
        "Enter your organization or team.",
    };
  }

  if (!title) {
    return {
      ok: false,

      message:
        "Enter your job title.",
    };
  }

  const accounts =
    readAccounts();

  const existing =
    accounts.find(
      (
        account
      ) =>
        account.email ===
        email
    );

  if (existing) {
    return {
      ok: false,

      message:
        "An account with this email already exists.",
    };
  }

  const passwordHash =
    await hashPassword(
      input.password
    );

  const account:
    StoredAccount = {
      id:
        `USR-${Date.now()}`,

      name,

      email,

      role:
        input.role,

      organization,

      title,

      createdAt:
        new Date().toISOString(),

      passwordHash,
    };

  writeAccounts([
    ...accounts,
    account,
  ]);

  const user =
    createSession(
      account
    );

  return {
    ok: true,

    message:
      "Account created successfully.",

    user,
  };
}

export async function signInWithCredentials(
  input: SignInInput
): Promise<AuthResult> {
  if (
    typeof window ===
    "undefined"
  ) {
    return {
      ok: false,

      message:
        "Sign in is only available in the browser.",
    };
  }

  const email =
    normalizeEmail(
      input.email
    );

  if (
    !email ||
    !input.password
  ) {
    return {
      ok: false,

      message:
        "Email and password are required.",
    };
  }

  const accounts =
    readAccounts();

  const account =
    accounts.find(
      (
        candidate
      ) =>
        candidate.email ===
        email
    );

  if (!account) {
    return {
      ok: false,

      message:
        "No account exists for this email. Create a profile first.",
    };
  }

  const passwordHash =
    await hashPassword(
      input.password
    );

  if (
    passwordHash !==
    account.passwordHash
  ) {
    return {
      ok: false,

      message:
        "Incorrect password.",
    };
  }

  const user =
    createSession(
      account
    );

  return {
    ok: true,

    message:
      "Signed in successfully.",

    user,
  };
}

export function updateCurrentUserProfile(
  updates: {
    name: string;

    organization: string;

    title: string;
  }
): AuthResult {
  const current =
    getCurrentUser();

  if (!current) {
    return {
      ok: false,

      message:
        "No authenticated session found.",
    };
  }

  const name =
    updates.name.trim();

  const organization =
    updates.organization.trim();

  const title =
    updates.title.trim();

  if (
    !name ||
    !organization ||
    !title
  ) {
    return {
      ok: false,

      message:
        "Name, organization and job title are required.",
    };
  }

  const accounts =
    readAccounts();

  const updatedAccounts =
    accounts.map(
      (
        account
      ) => {
        if (
          account.id !==
          current.id
        ) {
          return account;
        }

        return {
          ...account,

          name,

          organization,

          title,
        };
      }
    );

  writeAccounts(
    updatedAccounts
  );

  const updatedUser:
    AuthUser = {
      ...current,

      name,

      organization,

      title,
    };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(
      updatedUser
    )
  );

  emitAuthChanged();

  return {
    ok: true,

    message:
      "Profile updated successfully.",

    user:
      updatedUser,
  };
}

export function signOut() {
  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  localStorage.removeItem(
    SESSION_KEY
  );

  localStorage.removeItem(
    OLD_SESSION_KEY
  );

  localStorage.removeItem(
    LEGACY_KEY
  );

  /*
    This is what allows the cinematic
    intro to play again after logout.
  */

  localStorage.removeItem(
    INTRO_KEY
  );

  emitAuthChanged();
}

export function isAuthenticated() {
  return (
    getCurrentUser() !==
    null
  );
}

export function getExperienceMode() {
  return isAuthenticated()
    ? "AUTHENTICATED"
    : "GUEST_DEMO";
}