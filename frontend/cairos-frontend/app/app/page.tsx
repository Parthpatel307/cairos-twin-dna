"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowRight,
  Check,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import TiltCard from "@/components/ui/TiltCard";

import {
  useToast,
} from "@/components/ui/ToastProvider";

import {
  getDemoUser,
  signInDemoUser,
  type DemoRole,
} from "@/lib/demo-auth";

interface RoleOption {
  role: DemoRole;
  title: string;
  description: string;
  icon: LucideIcon;
}

const roles: RoleOption[] = [
  {
    role:
      "OPERATOR",

    title:
      "Operator",

    description:
      "Run simulations and controlled executions.",

    icon:
      UserRound,
  },

  {
    role:
      "REVIEWER",

    title:
      "Reviewer",

    description:
      "Review high-risk actions and grant human authorization.",

    icon:
      UserCheck,
  },

  {
    role:
      "ADMIN",

    title:
      "Admin",

    description:
      "Manage policies, platform settings and governance controls.",

    icon:
      ShieldCheck,
  },
];

export default function LoginPage() {
  const router =
    useRouter();

  const {
    showToast,
  } = useToast();

  const [
    name,
    setName,
  ] =
    useState(
      "Demo Operator"
    );

  const [
    role,
    setRole,
  ] =
    useState<DemoRole>(
      "OPERATOR"
    );

  useEffect(() => {
    const current =
      getDemoUser();

    if (!current) {
      return;
    }

    setName(
      current.name
    );

    setRole(
      current.role
    );
  }, []);

  const signIn =
    () => {
      const cleanName =
        name.trim();

      if (!cleanName) {
        showToast({
          type:
            "warning",

          title:
            "Name required",

          message:
            "Enter a demo identity before continuing.",
        });

        return;
      }
    const signedInAt =
      new Date().toISOString();

    signInDemoUser({
      id:
        `demo-${Date.now()}`,

      name:
        cleanName,

      email:
        "demo@cairos.local",

      organization:
        "CAIROS TWIN DNA",

      title:
        `${role} / Demo`,

      role,

      createdAt:
        signedInAt,

      signedInAt,
    });

      showToast({
        type:
          "success",

        title:
          "Identity activated",

        message:
          `${cleanName} signed in as ${role}.`,
      });

      router.push(
        "/"
      );
  };

  return (
    <div className="mx-auto max-w-[1150px] space-y-5 py-6">
      {/* HEADER */}

      <TiltCard
        intensity={3}
      >
        <section className="relative overflow-hidden p-7 md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-lime-300/[0.055] blur-[120px]" />

          <div className="relative">
            <div className="hero-kicker">
              <Fingerprint
                size={12}
              />

              IDENTITY LAYER
            </div>

            <h1 className="mt-5 text-5xl font-black tracking-[-0.065em] sm:text-6xl">
              SIGN IN
              <span className="text-lime-300">
                .
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/35">
              Choose a role for this
              CAIROS demo session.
              Authentication identity
              becomes useful for human
              approvals, execution
              authority and audit
              history.
            </p>
          </div>
        </section>
      </TiltCard>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.7fr]">
        {/* FORM */}

        <TiltCard
          intensity={3}
        >
          <section className="p-6 md:p-7">
            <p className="section-label">
              Demo Identity
            </p>

            <h2 className="section-title">
              Who is operating CAIROS?
            </h2>

            <div className="mt-6">
              <label className="text-[8px] font-black uppercase tracking-[0.14em] text-white/22">
                DISPLAY NAME
              </label>

              <div className="mt-2 flex items-center gap-3 rounded-[18px] border border-white/[0.07] bg-black/20 px-4">
                <UserRound
                  size={15}
                  className="text-white/22"
                />

                <input
                  value={
                    name
                  }
                  onChange={(
                    event
                  ) =>
                    setName(
                      event.target
                        .value
                    )
                  }
                  className="h-14 w-full bg-transparent text-sm text-white/70 outline-none placeholder:text-white/15"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[8px] font-black uppercase tracking-[0.14em] text-white/22">
                SELECT ROLE
              </p>

              <div className="mt-3 grid gap-3">
                {roles.map(
                  (
                    option
                  ) => {
                    const Icon =
                      option.icon;

                    const selected =
                      role ===
                      option.role;

                    return (
                      <button
                        key={
                          option.role
                        }
                        onClick={() =>
                          setRole(
                            option.role
                          )
                        }
                        className={`flex items-center gap-4 rounded-[20px] border p-4 text-left transition ${
                          selected
                            ? "border-lime-300/20 bg-lime-300/[0.045]"
                            : "border-white/[0.055] bg-black/15 hover:border-white/[0.1]"
                        }`}
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
                            selected
                              ? "border-lime-300/15 bg-lime-300/[0.06]"
                              : "border-white/[0.06] bg-white/[0.02]"
                          }`}
                        >
                          <Icon
                            size={17}
                            className={
                              selected
                                ? "text-lime-300"
                                : "text-white/22"
                            }
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-xs font-black ${
                              selected
                                ? "text-lime-200"
                                : "text-white/55"
                            }`}
                          >
                            {
                              option.title
                            }
                          </p>

                          <p className="mt-1 text-[9px] leading-5 text-white/20">
                            {
                              option.description
                            }
                          </p>
                        </div>

                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? "border-lime-300/20 bg-lime-300 text-black"
                              : "border-white/[0.07] text-transparent"
                          }`}
                        >
                          <Check
                            size={11}
                          />
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            <button
              onClick={
                signIn
              }
              className="lime-btn mt-7 w-full"
            >
              ACTIVATE IDENTITY

              <ArrowRight
                size={14}
              />
            </button>
          </section>
        </TiltCard>

        {/* INFO */}

        <TiltCard
          intensity={3}
        >
          <section className="h-full p-6 md:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-lime-300/15 bg-lime-300/[0.05]">
              <LockKeyhole
                size={20}
                className="text-lime-300"
              />
            </div>

            <h2 className="mt-6 text-2xl font-black tracking-[-0.04em] text-white/85">
              Identity matters
              when agents gain
              authority.
            </h2>

            <p className="mt-4 text-[11px] leading-7 text-white/28">
              Human approvals should
              be attributable to a
              reviewer instead of
              appearing as anonymous
              button clicks.
            </p>

            <div className="mt-7 space-y-3">
              <Benefit
                icon={
                  UserCheck
                }
                title="Approval attribution"
                detail="Know which reviewer authorized an action."
              />

              <Benefit
                icon={
                  ShieldCheck
                }
                title="Role-aware governance"
                detail="Operator, reviewer and admin responsibilities stay clear."
              />

              <Benefit
                icon={
                  UsersRound
                }
                title="Audit-ready identity"
                detail="Connect human decisions to execution history."
              />
            </div>

            <div className="mt-7 rounded-[20px] border border-yellow-300/10 bg-yellow-300/[0.018] p-4">
              <p className="text-[8px] font-black uppercase tracking-[0.13em] text-yellow-200">
                DEMO AUTH
              </p>

              <p className="mt-2 text-[9px] leading-5 text-white/22">
                This frontend identity
                is for the hackathon
                demo only. Real login,
                passwords, OAuth or JWT
                verification should be
                handled by the backend
                authentication layer.
              </p>
            </div>
          </section>
        </TiltCard>
      </div>
    </div>
  );
}

function Benefit({
  icon: Icon,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.055] bg-black/15 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <Icon
          size={14}
          className="text-lime-300"
        />
      </div>

      <div>
        <p className="text-[10px] font-black text-white/52">
          {title}
        </p>

        <p className="mt-1 text-[9px] leading-5 text-white/20">
          {detail}
        </p>
      </div>
    </div>
  );
}   