import "../styles/globals.css";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("civic_session_id")) {
      localStorage.setItem("civic_session_id", "s_" + Date.now() + "_" + Math.random().toString(36).slice(2));
    }
  }, []);

  return <Component {...pageProps} />;
}
