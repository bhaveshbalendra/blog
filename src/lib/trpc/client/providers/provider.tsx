"use client";
import { useEffect, useState } from "react";

import { TRPCReactProvider } from "../index";

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider = ({ children }: ProviderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <TRPCReactProvider>{children}</TRPCReactProvider>;
};
