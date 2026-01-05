import { useTheme } from "@/hooks/use-theme"
import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

type TCalculatorProps = {
  onResult: (value: string) => void
}

export default function Calculator({ onResult }: TCalculatorProps) {
  const theme = useTheme()
  const [display, setDisplay] = useState("0")
  const [currentValue, setCurrentValue] = useState("")
  const [operator, setOperator] = useState("")
  const [previousValue, setPreviousValue] = useState("")

  const handleNumberPress = (num: string) => {
    if (display === "0" && num !== ".") {
      setDisplay(num)
      setCurrentValue(num)
    } else {
      const newValue = display + num
      setDisplay(newValue)
      setCurrentValue(currentValue + num)
    }
  }

  const handleOperatorPress = (op: string) => {
    if (currentValue) {
      if (previousValue && operator) {
        handleCalculate()
      } else {
        setPreviousValue(currentValue)
      }
      setOperator(op)
      setCurrentValue("")
      setDisplay(display + " " + op + " ")
    }
  }

  const handleCalculate = () => {
    if (previousValue && currentValue && operator) {
      const prev = parseFloat(previousValue)
      const curr = parseFloat(currentValue)
      let result = 0

      switch (operator) {
        case "+":
          result = prev + curr
          break
        case "-":
          result = prev - curr
          break
        case "x":
          result = prev * curr
          break
        case "÷":
          result = curr !== 0 ? prev / curr : 0
          break
      }

      const resultStr = result.toString()
      setDisplay(resultStr)
      setCurrentValue(resultStr)
      setPreviousValue("")
      setOperator("")
      onResult(resultStr)
    }
  }

  const handleDelete = () => {
    if (display.length > 1) {
      const newDisplay = display.slice(0, -1)
      setDisplay(newDisplay)
      setCurrentValue(currentValue.slice(0, -1))
    } else {
      setDisplay("0")
      setCurrentValue("")
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setCurrentValue("")
    setOperator("")
    setPreviousValue("")
  }

  const renderButton = (label: string, onPress: () => void, isOperator = false, isEqual = false) => (
    <Pressable
      key={label}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isOperator || isEqual ? theme.colors.primary : theme.colors.surface,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: isOperator || isEqual ? "#ffffff" : theme.colors.text,
            fontSize: theme.fontSize["2xl"],
            fontWeight: theme.fontWeight.semibold,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )

  return (
    <View style={styles.container}>
      {/* Display Area */}
      <View
        style={[
          styles.displayContainer,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
        ]}
      >
        <Text
          style={[
            styles.displayText,
            {
              color: theme.colors.text,
              fontSize: 30,
              fontWeight: theme.fontWeight.bold,
            },
          ]}
          numberOfLines={1}
        >
          {display}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            {
              backgroundColor: theme.colors.background,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteIcon, { color: theme.colors.text, fontSize: theme.fontSize.xl }]}>
            ⌫
          </Text>
        </Pressable>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {/* Row 1 */}
        <View style={styles.row}>
          {renderButton("+", () => handleOperatorPress("+"), true)}
          {renderButton("7", () => handleNumberPress("7"))}
          {renderButton("8", () => handleNumberPress("8"))}
          {renderButton("9", () => handleNumberPress("9"))}
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          {renderButton("-", () => handleOperatorPress("-"), true)}
          {renderButton("4", () => handleNumberPress("4"))}
          {renderButton("5", () => handleNumberPress("5"))}
          {renderButton("6", () => handleNumberPress("6"))}
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          {renderButton("x", () => handleOperatorPress("x"), true)}
          {renderButton("1", () => handleNumberPress("1"))}
          {renderButton("2", () => handleNumberPress("2"))}
          {renderButton("3", () => handleNumberPress("3"))}
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          {renderButton("÷", () => handleOperatorPress("÷"), true)}
          {renderButton(".", () => handleNumberPress("."))}
          {renderButton("0", () => handleNumberPress("0"))}
          {renderButton("=", handleCalculate, false, true)}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  displayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingRight: 8,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 4,
    minHeight: 80,
  },
  displayText: {
    flex: 1,
    textAlign: "left",
    fontFamily: "Inter",
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  deleteIcon: {
    fontFamily: "Inter",
  },
  keypad: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Inter",
  },
})
