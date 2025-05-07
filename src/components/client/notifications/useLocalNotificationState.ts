import { useCallback, useEffect, useState } from "react";

export type NotificationPriority =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "IGNORED";
export type NotificationStatus = "UNREAD" | "READ";

export interface LocalNotificationState {
  id: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  ignored: boolean;
}

const STORAGE_KEY = "localNotificationState";

function loadState(): Record<string, LocalNotificationState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state: Record<string, LocalNotificationState>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useLocalNotificationState() {
  const [state, setState] =
    useState<Record<string, LocalNotificationState>>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const get = useCallback(
    (id: string): LocalNotificationState | undefined => state[id],
    [state]
  );

  const set = useCallback(
    (id: string, partial: Partial<LocalNotificationState>) => {
      setState((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          id,
          ...partial,
        },
      }));
    },
    []
  );

  const toggleRead = useCallback(
    (id: string) => {
      set(id, { status: state[id]?.status === "READ" ? "UNREAD" : "READ" });
    },
    [state, set]
  );

  const setPriority = useCallback(
    (id: string, priority: NotificationPriority) => {
      set(id, { priority });
    },
    [set]
  );

  const toggleIgnored = useCallback(
    (id: string) => {
      set(id, { ignored: !state[id]?.ignored });
    },
    [state, set]
  );

  return { get, set, toggleRead, setPriority, toggleIgnored, state };
}
