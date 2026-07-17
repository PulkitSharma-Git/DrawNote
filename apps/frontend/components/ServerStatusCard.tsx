"use client";

import { useEffect, useState, useRef } from "react";
import { HTTP_BACKEND, WS_URL } from "@/config";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Server, CheckCircle } from "lucide-react";

export default function ServerStatusCard() {
  const [httpHealthy, setHttpHealthy] = useState(false);
  const [wsHealthy, setWsHealthy] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);
  const [progress, setProgress] = useState(10);

  // Use refs to avoid stale closures inside setInterval/setTimeout callbacks
  const httpHealthyRef = useRef(false);
  const wsHealthyRef = useRef(false);
  const isCompletedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Handle loader progress over time or on completion
  useEffect(() => {
    if (isCompleted) {
      setProgress(100);
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const duration = 60000; // 60 seconds
      if (elapsed >= duration) {
        setProgress(90);
        clearInterval(interval);
      } else {
        const nextProgress = 10 + (elapsed / duration) * 80;
        setProgress(Math.min(90, Math.round(nextProgress)));
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isCompleted]);

  const httpHealthUrl = `${HTTP_BACKEND}/health`;
  const wsHealthUrl = WS_URL.replace(/^ws/, "http") + "/health";

  useEffect(() => {
    let active = true;
    let timer: NodeJS.Timeout;
    let pollInterval: NodeJS.Timeout;

    const checkHealth = async () => {
      try {
        const httpPromise = fetch(httpHealthUrl, { method: "GET", mode: "cors", cache: "no-store" })
          .then((res) => res.ok)
          .catch(() => false);

        const wsPromise = fetch(wsHealthUrl, { method: "GET", mode: "cors", cache: "no-store" })
          .then((res) => res.ok)
          .catch(() => false);

        const [httpOk, wsOk] = await Promise.all([httpPromise, wsPromise]);

        if (!active) return;

        // Update state and refs
        httpHealthyRef.current = httpOk;
        wsHealthyRef.current = wsOk;
        setHttpHealthy(httpOk);
        setWsHealthy(wsOk);

        if (httpOk && wsOk) {
          isCompletedRef.current = true;
          setIsCompleted(true);

          // Clear intervals/timeouts since we are fully healthy
          clearInterval(pollInterval);
          clearTimeout(timer);

          // Trigger card exit after showing "Ready" checkmark for 1 second
          setTimeout(() => {
            if (active) {
              setShowCard(false);
              // Allow exit animation to complete before removing from DOM
              setTimeout(() => {
                if (active) setShouldRender(false);
              }, 500);
            }
          }, 1000);
        }
      } catch (err) {
        if (active) {
          setHttpHealthy(false);
          setWsHealthy(false);
        }
      }
    };

    // Only show card if servers are NOT healthy after 400ms
    timer = setTimeout(() => {
      if (active && (!httpHealthyRef.current || !wsHealthyRef.current)) {
        setShowCard(true);
      }
    }, 400);

    checkHealth();

    // Start polling if servers are down
    pollInterval = setInterval(() => {
      if (active && !isCompletedRef.current) {
        checkHealth();
      } else {
        clearInterval(pollInterval);
      }
    }, 1500);

    return () => {
      active = false;
      clearTimeout(timer);
      clearInterval(pollInterval);
    };
  }, [httpHealthUrl, wsHealthUrl]);

  // If both servers are healthy from the beginning and we never show it
  if (!shouldRender) return null;

  return (
    <AnimatePresence>
      {showCard && (
        <div className="fixed inset-x-0 bottom-4 px-4 pointer-events-none flex justify-center sm:left-auto sm:right-6 sm:bottom-6 sm:inset-x-auto sm:px-0 z-[9999]">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="pointer-events-auto w-full sm:w-60 overflow-hidden rounded-xl border border-white/10 bg-neutral-950/80 text-white shadow-2xl backdrop-blur-xl"
          >
            {/* Thick Gradient Loader Bar */}
            <div className="h-2 w-full bg-neutral-900/60 overflow-hidden">
              <motion.div
                initial={{ width: "10%" }}
                animate={{ width: `${progress}%` }}
                transition={{
                  duration: progress === 100 ? 0.4 : 0.1,
                  ease: progress === 100 ? "easeOut" : "linear"
                }}
                className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-blue-500"
              />
            </div>

            {/* Card Body */}
            <div className="p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {progress < 100 ? "Connecting..." : "Connected"}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {progress}%
                </span>
              </div>

              {/* Servers Status List */}
              <div className="space-y-1">
                {/* HTTP Server */}
                <div className="flex items-center justify-between py-1 px-1">
                  <div className="flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-[11px] font-medium text-neutral-300">HTTP Server</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-neutral-400">
                      {httpHealthy ? "Online" : "Booting"}
                    </span>
                    <div className={`h-1.5 w-1.5 rounded-full ${httpHealthy ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  </div>
                </div>

                {/* WebSocket Server */}
                <div className="flex items-center justify-between py-1 px-1">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-[11px] font-medium text-neutral-300">WebSocket Server</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-neutral-400">
                      {wsHealthy ? "Online" : "Booting"}
                    </span>
                    <div className={`h-1.5 w-1.5 rounded-full ${wsHealthy ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
