"use client";

import { AutumnProvider as Provider } from "autumn-js/react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AutumnProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Provider
      userId={session?.user?.id}
      onUnauthenticated={() => {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }}
    >
      {children}
    </Provider>
  );
}
