import { palette } from "@/theme/colors"
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary"
  disabled?: boolean
  style?: ViewStyle
}

export function Button({ title, onPress, variant = "primary", disabled = false, style }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, variant === "primary" ? styles.primaryText : styles.secondaryText]}>
        {title}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  primary: {
    backgroundColor: palette.primaryBlue,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: palette.primaryBlue,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: palette.white,
  },
  secondaryText: {
    color: palette.primaryBlue,
  },
})
