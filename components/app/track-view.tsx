"use client";

import * as React from "react";

export function TrackView({ token }: { token: string }) {
  React.useEffect(() => {
    // Don't track if owner is previewing (cheap heuristic — referer from same origin)
    const key = `proponiq:viewed:${token}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch(`/api/p/${token}/track`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  }, [token]);

  return null;
}
