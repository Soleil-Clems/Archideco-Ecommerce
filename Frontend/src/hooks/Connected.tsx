import { useState, useEffect } from "react";

export function useConnected() {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const token: string | null = localStorage.getItem("authToken");
    if (token) {
      setConnected(true);
    }
  }, []);

  return connected;
}
