import { AutosizeTextField } from "@/components/materials/AutosizeTextField"
import { palette } from "@/theme/colors"
import { StyleSheet } from "react-native"

type TDescriptionProps = {
  onContentChange?: (content: string) => void
}

export const Description = ({ onContentChange }: TDescriptionProps) => {
  return (
    <AutosizeTextField
      placeholder="Nhập mô tả giao dịch..."
      styles={descriptionStyles}
      onContentChange={onContentChange}
      minHeight={112}
    />
  )
}

const descriptionStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    backgroundColor: palette.mainCloudBlue,
    borderWidth: 2,
    borderColor: palette.slate300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: palette.red400,
  },
  error: {
    fontFamily: "Inter",
    fontSize: 12,
    color: palette.red400,
    marginTop: 4,
  },
})
