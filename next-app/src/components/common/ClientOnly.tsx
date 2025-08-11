"use client";

import { useState, useEffect, FC, PropsWithChildren, ReactNode } from "react";

type ClientOnlyProps = PropsWithChildren & {
  fallback?: ReactNode;
};

const ClientOnly: FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ClientOnly;
