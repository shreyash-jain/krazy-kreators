"use client";

import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2 } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";

export type SubmissionDetails = {
  fullName?: string;
  services?: string;
  email?: string;
};

type SubmissionSuccessContentProps = {
  details: SubmissionDetails;
  onDone: () => void;
  titleId: string;
};

// The success view on its own, so the "Get in touch" popup can show it inside
// its existing dialog instead of stacking a second modal on top.
export function SubmissionSuccessContent({ details, onDone, titleId }: SubmissionSuccessContentProps) {
  const doneRef = useRef<HTMLButtonElement>(null);
  const firstName = details.fullName?.trim().split(/\s+/)[0];
  const service = details.services?.trim();
  const email = details.email?.trim();

  useEffect(() => {
    doneRef.current?.focus();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col items-center text-center px-6 py-8 sm:px-10 sm:py-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-[#CBB49A]/15"
        >
          <CheckCircle2 className="h-12 w-12 text-[#CBB49A]" strokeWidth={1.75} aria-hidden="true" />
        </motion.div>
        <h2 id={titleId} className="mt-6 text-2xl font-bold text-[#2D2A2E]">
          {firstName ? `Thank you, ${firstName}!` : "Thank you!"}
        </h2>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#666666]">
          {service ? (
            <>We&#39;ve received your enquiry about <span className="font-medium text-[#2D2A2E]">{service}</span>.</>
          ) : (
            <>We&#39;ve received your enquiry.</>
          )}{" "}
          Our team will reach out within 24 hours
          {email ? (
            <> at <span className="font-medium text-[#2D2A2E] break-words">{email}</span></>
          ) : null}
          .
        </p>
        <button
          ref={doneRef}
          type="button"
          onClick={onDone}
          className="mt-8 w-full sm:w-auto sm:min-w-[160px] inline-flex items-center justify-center rounded-full px-8 py-3 font-semibold text-white shadow-sm bg-gradient-to-r from-[#CBB49A] to-[#b7a078] hover:from-[#b7a078] hover:to-[#a69072] hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2A2E] focus-visible:ring-offset-2"
        >
          Done
        </button>
      </div>
    </MotionConfig>
  );
}

type SubmissionSuccessProps = {
  open: boolean;
  details: SubmissionDetails;
  onClose: () => void;
  // Where focus goes back to when the dialog closes (the form's submit button).
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export default function SubmissionSuccess({ open, details, onClose, returnFocusRef }: SubmissionSuccessProps) {
  const titleId = useId();
  // Read through a ref so a new onClose each parent render doesn't re-run the
  // effect below (which would bounce focus back to the form mid-dialog).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const returnTo = returnFocusRef?.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      // "Done" is the only control, so Tab stays on it.
      if (e.key === "Tab") e.preventDefault();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnTo?.focus();
    };
  }, [open, returnFocusRef]);

  if (!open) return null;

  // Portalled to <body> so a transformed (animated) ancestor can't break `fixed`.
  return createPortal(
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4"
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#ECE9E2]"
          onClick={(e) => e.stopPropagation()}
        >
          <SubmissionSuccessContent details={details} onDone={onClose} titleId={titleId} />
        </motion.div>
      </motion.div>
    </MotionConfig>,
    document.body
  );
}
