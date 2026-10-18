import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function remaining(endsAt: string): Countdown {
  const ms = new Date(endsAt).getTime() - Date.now();
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    expired: ms <= 0,
  };
}

/** Live countdown, null on the server so SSR markup never drifts. */
export function useCountdown(endsAt: string | null) {
  const [value, setValue] = useState<Countdown | null>(null);
  useEffect(() => {
    if (!endsAt) return setValue(null);
    setValue(remaining(endsAt));
    const id = window.setInterval(() => setValue(remaining(endsAt)), 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);
  return value;
}
