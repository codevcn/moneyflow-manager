import { palette } from "@/theme/colors"
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native"

interface TextFieldProps extends TextInputProps {
  label?: string
  error?: string
}

export function TextField({ label, error, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={palette.slate600}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "600",
    color: palette.slate900,
    marginBottom: 8,
  },
  input: {
    fontFamily: "Inter",
    fontSize: 16,
    color: palette.slate900,
    backgroundColor: palette.white,
    borderWidth: 2,
    borderColor: palette.slate200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  inputError: {
    borderColor: palette.red600,
  },
  error: {
    fontFamily: "Inter",
    fontSize: 12,
    color: palette.red600,
    marginTop: 4,
  },
})
