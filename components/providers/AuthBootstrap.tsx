"use client";

import { useEffect } from "react";
import { restoreSessionRequest } from "@/redux/auth/action";
import { useAppDispatch } from "@/redux/hooks";

// Runs the one-time session check (GET /auth/me, if a token is stored) once
// per app load. Renders nothing — purely a dispatch-on-mount wrapper, same
// pattern as AntdThemeBridge in app/providers.tsx.
export default function AuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSessionRequest());
  }, [dispatch]);

  return null;
}
