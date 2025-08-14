"use client";

import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";

export default function SafeHydration({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}
