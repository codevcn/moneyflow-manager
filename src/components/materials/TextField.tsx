import { useTheme } from "@/hooks/use-theme"
import { TAppTheme } from "@/utils/types/theme.type"
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

type TTextFieldProps = TextInputProps & {
  label?: string
  error?: string
}

function createStyles(theme: TAppTheme) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    input: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      minHeight: 56,
    },
    inputError: {
      borderColor: theme.colors.danger,
    },
    error: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.sm,
      color: theme.colors.danger,
      marginTop: theme.spacing.xs,
    },
  })
}

export function TextField({ label, error, style, ...props }: TTextFieldProps) {
  const theme = useTheme()
  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={theme.colors.textMuted}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}
