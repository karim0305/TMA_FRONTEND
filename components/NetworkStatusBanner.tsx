import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Platform, Text, View } from "react-native";

let NetInfo: any = null;
try {
  // Optional dependency; will work once installed: `expo install @react-native-community/netinfo`
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  NetInfo = require("@react-native-community/netinfo");
} catch (e) {
  // Fallback for web or when NetInfo isn't installed yet
  NetInfo = null;
}

function useConnectivity() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (NetInfo && NetInfo.addEventListener) {
      // Initial fetch
      NetInfo.fetch().then((state: any) => {
        const online =
          Platform.OS === "android"
            ? Boolean(state?.isConnected)
            : Boolean(state?.isConnected && state?.isInternetReachable !== false);
        setIsConnected(online);
      });
      unsubscribe = NetInfo.addEventListener((state: any) => {
        const online =
          Platform.OS === "android"
            ? Boolean(state?.isConnected)
            : Boolean(state?.isConnected && state?.isInternetReachable !== false);
        setIsConnected(online);
      });
      return () => unsubscribe && unsubscribe();
    }

    // Web or no NetInfo installed: use navigator.onLine
    const update = () => setIsConnected(typeof navigator !== "undefined" ? navigator.onLine : true);
    update();
    if (Platform.OS === "web") {
      window.addEventListener("online", update);
      window.addEventListener("offline", update);
      return () => {
        window.removeEventListener("online", update);
        window.removeEventListener("offline", update);
      };
    }
  }, []);

  return isConnected;
}

export default function NetworkStatusBanner() {
  const isConnected = useConnectivity();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"online" | "offline">("online");
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isConnected === null) return; // still determining

    if (isConnected) {
      // show a short green banner when back online
      setMode("online");
      setVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setVisible(false), 1800);
    } else {
      // show persistent red banner while offline
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setMode("offline");
      setVisible(true);
    }
  }, [isConnected]);

  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  const styles = useMemo(
    () => ({
      container: {
        position: "absolute" as const,
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        paddingTop: Platform.select({ ios: 50, default: 20 }),
        paddingBottom: 10,
        paddingHorizontal: 12,
        alignItems: "center" as const,
      },
      bar: {
        minHeight: 36,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: "100%" as const,
        maxWidth: 720,
        flexDirection: "row" as const,
        alignItems: "center" as const,
        gap: 8,
      },
      text: {
        color: "#fff",
        fontWeight: "600" as const,
        fontSize: 14,
        flexShrink: 1,
      },
    }),
    []
  );

  if (!visible) return null;

  const isOffline = mode === "offline";
  const backgroundColor = isOffline ? "#ef4444" : "#16a34a"; // red-500 / green-600
  const message = isOffline ? "No internet connection. Trying to reconnect…" : "Back online";

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <View style={[styles.bar, { backgroundColor }]}>
        {isOffline ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <ActivityIndicator size="small" color="#fff" />
        )}
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}
