"use client";
import { SessionProvider } from "next-auth/react";
import ChunkErrorHandler from "./ChunkErrorHandler";

export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      <ChunkErrorHandler />
      {children}
    </SessionProvider>
  );
}