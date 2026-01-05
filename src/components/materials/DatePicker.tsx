import { useTheme } from "@/hooks/use-theme"
import { formatDate } from "@/utils/formatters"
import { TAppTheme } from "@/utils/types/theme.type"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { useState } from "react"
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native"

type TDatePickerProps = {
  label?: string
  value: number
  onChange: (timestamp: number) => void
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
    button: {
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      minHeight: 56,
      justifyContent: "center",
    },
    buttonError: {
      borderColor: theme.colors.danger,
    },
    buttonPressed: {
      opacity: 0.7,
    },
    buttonText: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
    },
    error: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.sm,
      color: theme.colors.danger,
      marginTop: theme.spacing.xs,
    },
  })
}

export function DatePicker({ label, value, onChange, error }: TDatePickerProps) {
  const theme = useTheme()
  const styles = createStyles(theme)
  const [showPicker, setShowPicker] = useState(false)

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false)
    }

    if (event.type === "set" && selectedDate) {
      const timestamp = Math.floor(selectedDate.getTime() / 1000)
      onChange(timestamp)
    }
  }

  const handlePress = () => {
    setShowPicker(true)
  }

  const handleCancel = () => {
    setShowPicker(false)
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          error && styles.buttonError,
          pressed && styles.buttonPressed,
        ]}
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{formatDate(value)}</Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      {showPicker && Platform.OS === "ios" && (
        <Modal transparent animationType="slide" visible={showPicker} onRequestClose={handleCancel}>
          <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: theme.colors.surface, padding: theme.spacing.md }}>
              <DateTimePicker
                value={new Date(value * 1000)}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={{ backgroundColor: theme.colors.surface }}
              />
              <Pressable
                style={{
                  backgroundColor: theme.colors.primary,
                  padding: theme.spacing.md,
                  borderRadius: theme.radius.md,
                  alignItems: "center",
                  marginTop: theme.spacing.sm,
                }}
                onPress={handleCancel}
              >
                <Text style={{ color: "#ffffff", fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold }}>
                  Xong
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {showPicker && Platform.OS === "android" && (
        <DateTimePicker
          value={new Date(value * 1000)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  )
}
