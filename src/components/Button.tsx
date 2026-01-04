import { useTheme } from "@/hooks/use-theme"
import { TAppTheme } from "@/utils/types/theme.type"
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native"

type TButtonProps = {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary"
  disabled?: boolean
  style?: ViewStyle
}

function createStyles(theme: TAppTheme) {
  return StyleSheet.create({
    button: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 56,
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    disabled: {
      opacity: 0.5,
    },
    pressed: {
      opacity: 0.8,
    },
    text: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
    },
    primaryText: {
      color: theme.colors.background,
    },
    secondaryText: {
      color: theme.colors.primary,
    },
  })
}

export function Button({ title, onPress, variant = "primary", disabled = false, style }: TButtonProps) {
  const theme = useTheme()
  const styles = createStyles(theme)

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
