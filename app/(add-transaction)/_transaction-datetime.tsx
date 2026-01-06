import ExpandIcon from "@/../assets/images/icons/expand-icon.svg"
import { palette } from "@/theme/colors"
import { formatDate, formatTime } from "@/utils/formatters"
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker"
import { useState } from "react"
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native"

type TTransactionDatetimeProps = {
  onPickDatetime: (datetime: Date) => void
}

type TPickerMode = "date" | "time" | null

export const TransactionDatetime = ({ onPickDatetime }: TTransactionDatetimeProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [pickerMode, setPickerMode] = useState<TPickerMode>(null)

  const handleDateTimeChange = (event: DateTimePickerEvent, selectedDateTime?: Date) => {
    if (Platform.OS === "android") {
      setPickerMode(null)
    }

    if (event.type === "set" && selectedDateTime) {
      setSelectedDate(selectedDateTime)
      onPickDatetime(selectedDateTime)
    }
  }

  const handleOpenDatePicker = () => {
    setPickerMode("date")
  }

  const handleOpenTimePicker = () => {
    setPickerMode("time")
  }

  const handleClosePicker = () => {
    setPickerMode(null)
  }

  const dateTimestamp = Math.floor(selectedDate.getTime() / 1000)
  const timeString = `${String(selectedDate.getHours()).padStart(2, "0")}:${String(
    selectedDate.getMinutes()
  ).padStart(2, "0")}`

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [styles.pickerButton, pressed && styles.pickerButtonPressed]}
          onPress={handleOpenDatePicker}
        >
          <Text style={styles.pickerButtonText}>{formatDate(dateTimestamp)}</Text>
          <ExpandIcon width={18} height={18} strokeWidth={3} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.pickerButton, pressed && styles.pickerButtonPressed]}
          onPress={handleOpenTimePicker}
        >
          <Text style={styles.pickerButtonText}>{formatTime(timeString, "24h")}</Text>
          <ExpandIcon width={18} height={18} strokeWidth={3} />
        </Pressable>
      </View>

      {pickerMode && Platform.OS === "ios" && (
        <Modal
          transparent
          animationType="slide"
          visible={pickerMode !== null}
          onRequestClose={handleClosePicker}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedDate}
                mode={pickerMode}
                display="spinner"
                onChange={handleDateTimeChange}
              />
              <Pressable style={styles.doneButton} onPress={handleClosePicker}>
                <Text style={styles.doneButtonText}>Xong</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}

      {pickerMode && Platform.OS === "android" && (
        <DateTimePicker
          value={selectedDate}
          mode={pickerMode}
          display="default"
          onChange={handleDateTimeChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: palette.slate50,
    borderTopWidth: 1,
    borderTopColor: palette.slate300,
    borderBottomWidth: 1,
    borderBottomColor: palette.slate300,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  pickerButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: palette.slate300,
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 46,
  },
  pickerButtonPressed: {
    opacity: 0.7,
  },
  pickerButtonText: {
    fontFamily: "Inter",
    fontSize: 18,
    color: palette.slate800,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
  },
  doneButton: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  doneButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
})
