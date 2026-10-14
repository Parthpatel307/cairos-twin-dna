"use client";

import {
  AUTH_EVENT,
  getCurrentUser,
  signOut,
  type AuthRole,
  type AuthUser,
} from "@/lib/auth";

export type DemoRole =
  AuthRole;

export type DemoUser =
  AuthUser;

export {
  AUTH_EVENT,
};

export function getDemoUser():
  DemoUser | null {
  return getCurrentUser();
}

export function signOutDemoUser() {
  signOut();
}

/*
  Kept only so older imports do not
  suddenly break during migration.

  New login UI uses:
  signInWithCredentials()
  createLocalAccount()
*/

export async function signInDemoUser(
  _user: DemoUser
) {
  throw new Error(
    "Legacy name-only sign in is disabled. Use credential authentication."
  );
}