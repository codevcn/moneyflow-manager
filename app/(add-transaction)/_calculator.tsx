import { palette } from "@/theme/colors"
import { ToasterControl } from "@/utils/toaster.control"
import { useRef, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

type TCalculatorButtonProps = {
  label: string
  onPress: () => void
  isOperator?: boolean
  isEqual?: boolean
}

const CalculatorButton = ({
  label,
  onPress,
  isOperator = false,
  isEqual = false,
}: TCalculatorButtonProps) => {
  return (
    <Pressable
      key={label}
      style={({ pressed }) => [
        styles.keyButton,
        {
          backgroundColor: isOperator || isEqual ? palette.mainBlue : palette.slate50,
          opacity: pressed ? 0.7 : 1,
          borderColor: isOperator || isEqual ? palette.mainBlue : palette.slate300,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          {
            color: isOperator || isEqual ? "#ffffff" : palette.slate800,
            fontSize: 24,
            fontWeight: "600",
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

const formatMoney = (value: string): string => {
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  }
  return value
}

const isValidNumber = (value: string): boolean => {
  return /^-?\d+(\.\d+)?$/.test(value)
}

type TCalculatorProps = {
  onCurrentValueChange: (value: string) => void
}

export const Calculator = ({ onCurrentValueChange }: TCalculatorProps) => {
  const [display, setDisplay] = useState("0")
  const currentValue = useRef("")
  const previousValue = useRef("")
  const operator = useRef("")

  const handleNumberPress = (num: string) => {
    if (display === "0" && num !== ".") {
      setDisplay(num)
      currentValue.current = num
      onCurrentValueChange(num)
    } else {
      const newValue = currentValue.current + num
      const decimalParts = newValue.split(".")
      if (decimalParts && decimalParts[1] && decimalParts[1].length > 2) {
        return // Prevent multiple decimals
      }
      currentValue.current = newValue
      setDisplay(display + num)
      onCurrentValueChange(newValue)
    }
  }

  const handleOperatorPress = (op: string) => {
    console.log(">>> [cal] op press:", {
      op,
      currentValue: currentValue.current,
      previousValue: previousValue.current,
      operator: operator.current,
    })
    if (currentValue.current) {
      if (previousValue.current && operator.current) {
        handleCalculate(op)
        return
      } else {
        previousValue.current = currentValue.current
      }
      operator.current = op
      currentValue.current = ""
      onCurrentValueChange("")
      setDisplay(display + " " + op + " ")
    }
  }

  const handleCalculate = (upcommingOperator?: string) => {
    if (previousValue.current && currentValue.current && operator.current) {
      if (!isValidNumber(previousValue.current) || !isValidNumber(currentValue.current)) {
        ToasterControl.show("Giá trị không hợp lệ", "error")
        return
      }
      const prev = parseFloat(previousValue.current)
      const curr = parseFloat(currentValue.current)
      let result = 0

      switch (operator.current) {
        case "+":
          result = prev + curr
          break
        case "-":
          result = prev - curr
          break
        case "*":
          result = prev * curr
          break
        case "÷":
          result = curr !== 0 ? prev / curr : 0
          break
      }

      const resultStr = result.toString()
      if (upcommingOperator && operator.current && previousValue.current && currentValue.current) {
        operator.current = upcommingOperator
        currentValue.current = ""
        previousValue.current = resultStr
        setDisplay(resultStr + " " + upcommingOperator + " ")
      } else {
        operator.current = ""
        currentValue.current = resultStr
        previousValue.current = ""
        setDisplay(resultStr)
      }
      onCurrentValueChange(resultStr)
    }
  }

  const handleDelete = () => {
    if (display.length > 1) {
      const newDisplay = display.slice(0, -1)
      setDisplay(newDisplay)
      currentValue.current = currentValue.current.slice(0, -1)
      onCurrentValueChange(currentValue.current)
    } else {
      setDisplay("0")
      currentValue.current = ""
      onCurrentValueChange("")
    }
  }

  const handleClear = () => {
    setDisplay("0")
    currentValue.current = ""
    onCurrentValueChange("")
    operator.current = ""
    previousValue.current = ""
  }

  return (
    <View style={styles.container}>
      {/* Display Area */}
      <View style={[styles.displayContainer]}>
        <Text style={[styles.displayText]}>
          <Text>{formatMoney(display)}</Text>
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            {
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteIcon]}>⌫</Text>
        </Pressable>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {/* Row 1 */}
        <View style={styles.row}>
          <CalculatorButton label="+" onPress={() => handleOperatorPress("+")} isOperator />
          <CalculatorButton label="7" onPress={() => handleNumberPress("7")} />
          <CalculatorButton label="8" onPress={() => handleNumberPress("8")} />
          <CalculatorButton label="9" onPress={() => handleNumberPress("9")} />
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <CalculatorButton label="-" onPress={() => handleOperatorPress("-")} isOperator />
          <CalculatorButton label="4" onPress={() => handleNumberPress("4")} />
          <CalculatorButton label="5" onPress={() => handleNumberPress("5")} />
          <CalculatorButton label="6" onPress={() => handleNumberPress("6")} />
        </View>

        {/* Row 3 */}
        <View style={styles.row}>
          <CalculatorButton label="*" onPress={() => handleOperatorPress("*")} isOperator />
          <CalculatorButton label="1" onPress={() => handleNumberPress("1")} />
          <CalculatorButton label="2" onPress={() => handleNumberPress("2")} />
          <CalculatorButton label="3" onPress={() => handleNumberPress("3")} />
        </View>

        {/* Row 4 */}
        <View style={styles.row}>
          <CalculatorButton label="÷" onPress={() => handleOperatorPress("÷")} isOperator />
          <CalculatorButton label="." onPress={() => handleNumberPress(".")} />
          <CalculatorButton label="0" onPress={() => handleNumberPress("0")} />
          <CalculatorButton label="=" onPress={() => handleCalculate()} isEqual />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    paddingHorizontal: 8,
  },
  displayContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingRight: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.slate300,
    backgroundColor: palette.slate50,
    marginBottom: 4,
    height: 70,
  },
  displayText: {
    flex: 1,
    fontFamily: "Inter",
    verticalAlign: "top",
    color: palette.slate900,
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 30,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    backgroundColor: "#fff",
    borderColor: palette.slate300,
    borderWidth: 2,
  },
  deleteIcon: {
    fontFamily: "Inter",
    color: palette.slate900,
    fontSize: 24,
  },
  keypad: {
    gap: 4,
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  keyButton: {
    flex: 1,
    aspectRatio: 5 / 4,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderColor: palette.slate300,
    borderWidth: 2,
  },
  buttonText: {
    fontFamily: "Inter",
  },
})
