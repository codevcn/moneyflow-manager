import { palette } from "@/theme/colors"
import { useState } from "react"
import { Text, TextInput, TextStyle, View, ViewStyle } from "react-native"

type TStyles = {
  container: ViewStyle
  label: TextStyle
  input: TextStyle
  inputError: TextStyle
  error: TextStyle
}

type TContentSizeChangeEvent = {
  nativeEvent: {
    contentSize: {
      height: number
    }
  }
}

type TAutosizeTextFieldProps = Partial<{
  label: string
  error: string
  minHeight: number
  maxHeight: number
  onContentChange: (content: string) => void
  styles: Partial<TStyles>
  placeholder?: string
}>

export function AutosizeTextField({
  label,
  error,
  minHeight = 56,
  maxHeight = 200,
  styles,
  onContentChange,
  placeholder,
}: TAutosizeTextFieldProps) {
  const [height, setHeight] = useState(minHeight)

  const handleContentSizeChange = (event: TContentSizeChangeEvent) => {
    const contentHeight = event.nativeEvent.contentSize.height
    const newHeight = Math.max(minHeight, Math.min(contentHeight, maxHeight))
    setHeight(newHeight)
  }

  const handleContentChange = (text: string) => {
    if (onContentChange) {
      onContentChange(text)
    }
  }

  return (
    <View style={styles?.container}>
      {label && <Text style={styles?.label}>{label}</Text>}
      <TextInput
        style={[styles?.input, error && styles?.inputError, { height }]}
        placeholderTextColor={palette.slate600}
        multiline
        onContentSizeChange={handleContentSizeChange}
        onChangeText={handleContentChange}
        placeholder={placeholder}
      />
      {error && <Text style={styles?.error}>{error}</Text>}
    </View>
  )
}
