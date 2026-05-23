"use client";

import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get("from") ?? "/admin";
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    setError(null);
    start(async () => {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) setError("Invalid credentials.");
      else router.push(from);
    });
  };

  return (
    <main className="flex min-h-dvh items-center bg-ink-950">
      <Container size="narrow">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-md"
        >
          <Text variant="caption" className="text-paper/40">
            Admin
          </Text>
          <h1 className="mt-3 text-display-md font-display tracking-[-0.025em] text-paper">
            Sign in.
          </h1>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <Field label="Email" name="email" type="email" required autoFocus />
            <Field label="Password" name="password" type="password" required />

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-caption uppercase tracking-[0.12em] text-rose-300"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="mt-4 w-full rounded-full bg-paper px-6 py-3 font-mono text-label uppercase tracking-[0.16em] text-ink-950 transition-opacity disabled:opacity-50"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </motion.div>
      </Container>
    </main>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="font-mono text-caption uppercase tracking-[0.16em] text-paper/50">
        {label}
      </span>
      <input
        {...props}
        className="mt-2 w-full border-b border-ink-700/60 bg-transparent py-2.5 text-body text-paper outline-none transition-colors focus:border-accent-500"
      />
    </label>
  );
}
