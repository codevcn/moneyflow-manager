import CloseIcon from "@/../assets/images/icons/outlined-close-icon.svg"
import { useToastStore } from "@/stores/toast.store"
import React, { useEffect, useRef, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const bgByType = (type: "info" | "success" | "error") => {
  switch (type) {
    case "success":
      return "#57ff95ff"
    case "error":
      return "#ff6767ff"
    default:
      return "#111827"
  }
}

export const Toaster = () => {
  const { visible, message, type, hide } = useToastStore()
  const insets = useSafeAreaInsets()
  const [countdown, setCountdown] = useState(3)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!visible) return

    setCountdown(3)

    if (timerRef.current) clearInterval(timerRef.current)

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        const next = prev - 1
        if (next <= 0) {
          hide()
          return 0
        }
        return next
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [visible])

  if (!visible) return null

  const handlePressOut = () => {
    hide()
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View pointerEvents="box-none" style={[styles.wrap, { top: insets.top + 12 }]}>
        <View style={[styles.toast, { backgroundColor: bgByType(type) }]}>
          <Pressable
            onPressOut={handlePressOut}
            style={styles.pressable}
            accessibilityRole="button"
            accessibilityLabel="Toast"
          >
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <View style={styles.row}>
                <CloseIcon width={20} height={20} color="white" />
                <Text style={styles.text} numberOfLines={3}>
                  {message}
                </Text>
              </View>

              <View style={styles.badge}>
                <Text style={styles.badgeText}>{countdown}s</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  toast: {
    width: "92%",
    borderRadius: 8,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  pressable: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },
  badge: {
    alignItems: "center",
    minWidth: 44,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  badgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
})
