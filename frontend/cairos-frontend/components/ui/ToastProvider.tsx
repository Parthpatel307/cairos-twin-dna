"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";

type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

interface ToastItem {
  id: number;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastOptions {
  title: string;
  message?: string;
  type?: ToastType;
}

interface ToastContextValue {
  showToast: (
    options: ToastOptions
  ) => void;
}

const ToastContext =
  createContext<
    ToastContextValue | undefined
  >(undefined);

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] =
    useState<ToastItem[]>([]);

  const removeToast =
    useCallback(
      (id: number) => {
        setToasts(
          (current) =>
            current.filter(
              (toast) =>
                toast.id !== id
            )
        );
      },
      []
    );

  const showToast =
    useCallback(
      ({
        title,
        message,
        type = "info",
      }: ToastOptions) => {
        const id = Date.now();

        setToasts(
          (current) => [
            ...current,
            {
              id,
              title,
              message,
              type,
            },
          ]
        );

        window.setTimeout(
          () => {
            removeToast(id);
          },
          3800
        );
      },
      [removeToast]
    );

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-[calc(100%-40px)] max-w-sm flex-col gap-3">
        {toasts.map(
          (toast) => (
            <ToastCard
              key={toast.id}
              toast={toast}
              onClose={() =>
                removeToast(
                  toast.id
                )
              }
            />
          )
        )}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: ToastItem;
  onClose: () => void;
}) {
  const config = {
    success: {
      icon: CheckCircle2,
      iconClass:
        "text-lime-300",
      border:
        "border-lime-300/20",
      glow:
        "shadow-[0_0_50px_rgba(190,242,100,0.08)]",
    },

    error: {
      icon: XCircle,
      iconClass:
        "text-red-300",
      border:
        "border-red-400/20",
      glow:
        "shadow-[0_0_50px_rgba(248,113,113,0.08)]",
    },

    warning: {
      icon: AlertTriangle,
      iconClass:
        "text-yellow-200",
      border:
        "border-yellow-300/20",
      glow:
        "shadow-[0_0_50px_rgba(253,224,71,0.06)]",
    },

    info: {
      icon: Info,
      iconClass:
        "text-blue-200",
      border:
        "border-blue-300/20",
      glow:
        "shadow-[0_0_50px_rgba(147,197,253,0.06)]",
    },
  };

  const selected =
    config[toast.type];

  const Icon =
    selected.icon;

  return (
    <div
      className={`pointer-events-auto flex gap-3 rounded-2xl border ${selected.border} ${selected.glow} bg-[#0b0e0b]/95 p-4 backdrop-blur-xl`}
    >
      <div className="mt-0.5">
        <Icon
          size={19}
          className={
            selected.iconClass
          }
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-black text-white/80">
          {toast.title}
        </p>

        {toast.message && (
          <p className="mt-1 text-[11px] leading-5 text-white/35">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white/20 transition hover:bg-white/[0.05] hover:text-white/60"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function useToast() {
  const context =
    useContext(
      ToastContext
    );

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider"
    );
  }

  return context;
}