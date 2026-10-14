"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0e0b] shadow-[0_0_80px_rgba(0,0,0,.7)]">
        <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
          <div>
            <p className="text-[9px] font-black tracking-[0.18em] text-lime-300">
              CAIROS GOVERNANCE
            </p>

            <h2 className="mt-1 text-lg font-black">
              {title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-white/[0.08] p-2 text-white/30 transition hover:bg-white/[0.04] hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}