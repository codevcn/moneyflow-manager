import { useTheme } from "@/hooks/use-theme"
import { TAppTheme } from "@/utils/types/theme.type"
import { useState } from "react"
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

type TAmountInputProps = Omit<TextInputProps, "value" | "onChangeText"> & {
  label?: string
  error?: string
  value: string
  onChangeValue: (value: string) => void
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
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.semibold,
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

/**
 * Format number với dấu phẩy phân cách nghìn
 */
function formatNumber(value: string): string {
  const cleaned = value.replace(/[^0-9.]/g, "")
  const parts = cleaned.split(".")
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const decimalPart = parts[1] !== undefined ? `.${parts[1]}` : ""
  return integerPart + decimalPart
}

/**
 * Parse number từ format string
 */
function parseNumber(formatted: string): string {
  return formatted.replace(/,/g, "")
}

export function AmountInput({ label, error, value, onChangeValue, style, ...props }: TAmountInputProps) {
  const theme = useTheme()
  const styles = createStyles(theme)
  const [displayValue, setDisplayValue] = useState(formatNumber(value))

  const handleChangeText = (text: string) => {
    const parsed = parseNumber(text)
    const formatted = formatNumber(parsed)
    setDisplayValue(formatted)
    onChangeValue(parsed)
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={theme.colors.textMuted}
        value={displayValue}
        onChangeText={handleChangeText}
        keyboardType="decimal-pad"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}
