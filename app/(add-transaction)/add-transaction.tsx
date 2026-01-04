import CheckIcon from "@/../assets/images/icons/check-icon.svg"
import { AccountRepository } from "@/configs/db/repository/account.repo"
import { TransactionRepository } from "@/configs/db/repository/transaction.repo"
import { MESSAGES } from "@/constants/messages"
import { useTheme } from "@/hooks/use-theme"
import { getCurrentTimeString, getCurrentTimestamp } from "@/utils/formatters"
import { TAccount } from "@/utils/types/db/account.type"
import { TTransactionType } from "@/utils/types/db/transaction.type"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, Dimensions, KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from "react-native"
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { Calculator } from "./calculator"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

type TFormData = {
  amount: string
  date: number
  description: string
  categoryId: number | null
}

type TFormErrors = {
  amount?: string
  date?: string
  description?: string
  categoryId?: string
}

export default function AddTransactionScreen() {
  const theme = useTheme()
  const scrollViewRef = useRef<any>(null)
  const scrollX = useSharedValue(0)

  const [currentAccount, setCurrentAccount] = useState<TAccount | null>(null)
  const [activeTab, setActiveTab] = useState<TTransactionType>("expense")
  const [loading, setLoading] = useState(false)

  const [expenseForm, setExpenseForm] = useState<TFormData>({
    amount: "",
    date: getCurrentTimestamp(),
    description: "",
    categoryId: null,
  })

  const [incomeForm, setIncomeForm] = useState<TFormData>({
    amount: "",
    date: getCurrentTimestamp(),
    description: "",
    categoryId: null,
  })

  const [expenseErrors, setExpenseErrors] = useState<TFormErrors>({})
  const [incomeErrors, setIncomeErrors] = useState<TFormErrors>({})

  useEffect(() => {
    loadAccount()
  }, [])

  const loadAccount = async () => {
    try {
      const accountRepo = new AccountRepository()
      const account = await accountRepo.getFirst()
      setCurrentAccount(account)
    } catch (error) {
      console.error("Error loading account:", error)
      Alert.alert("Lỗi", "Không thể tải thông tin tài khoản")
      router.back()
    }
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x
    },
  })

  const handleTabPress = (tab: TTransactionType) => {
    setActiveTab(tab)
    const offsetX = tab === "expense" ? 0 : SCREEN_WIDTH
    scrollViewRef.current?.scrollTo({ x: offsetX, animated: true })
  }

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(activeTab === "expense" ? 0 : SCREEN_WIDTH / 2, { duration: 200 }),
        },
      ],
    }
  })

  const validateForm = (form: TFormData): TFormErrors => {
    const errors: TFormErrors = {}

    if (!form.amount || parseFloat(form.amount) <= 0) {
      errors.amount = MESSAGES.VALIDATION.AMOUNT_POSITIVE
    }

    return errors
  }

  const handleSave = async () => {
    if (!currentAccount) {
      Alert.alert("Lỗi", "Không tìm thấy tài khoản")
      return
    }

    const form = activeTab === "expense" ? expenseForm : incomeForm
    const errors = validateForm(form)

    if (activeTab === "expense") {
      setExpenseErrors(errors)
    } else {
      setIncomeErrors(errors)
    }

    if (Object.keys(errors).length > 0) {
      Alert.alert("Lỗi", "Vui lòng kiểm tra lại thông tin")
      return
    }

    setLoading(true)

    try {
      const transactionRepo = new TransactionRepository()
      await transactionRepo.create({
        account_id: currentAccount.id,
        category_id: form.categoryId,
        type: activeTab,
        amount: parseFloat(form.amount),
        description: form.description.trim() || undefined,
        transaction_date: form.date,
        transaction_time: getCurrentTimeString(),
      })

      Alert.alert("Thành công", MESSAGES.SUCCESS.TRANSACTION_CREATED, [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ])
    } catch (error) {
      console.error("Error creating transaction:", error)
      Alert.alert("Lỗi", MESSAGES.ERROR.CREATE_TRANSACTION_FAILED)
    } finally {
      setLoading(false)
    }
  }

  const updateExpenseForm = (field: keyof TFormData, value: any) => {
    setExpenseForm({ ...expenseForm, [field]: value })
    setExpenseErrors({ ...expenseErrors, [field]: undefined })
  }

  const updateIncomeForm = (field: keyof TFormData, value: any) => {
    setIncomeForm({ ...incomeForm, [field]: value })
    setIncomeErrors({ ...incomeErrors, [field]: undefined })
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior="height"
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface }]}>
          <Pressable
            style={[
              styles.tab,
              { backgroundColor: activeTab === "expense" ? theme.colors.danger : "transparent" },
            ]}
            onPress={() => handleTabPress("expense")}
          >
            {activeTab === "expense" ? <CheckIcon height={24} width={24} color="#fff" /> : null}
            <Text style={[styles.tabText, { color: activeTab === "expense" ? "#fff" : "#000" }]}>
              Chi tiêu
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              { backgroundColor: activeTab === "income" ? theme.colors.primary : "transparent" },
            ]}
            onPress={() => handleTabPress("income")}
          >
            {activeTab === "income" ? <CheckIcon height={24} width={24} color="#fff" /> : null}
            <Text style={[styles.tabText, { color: activeTab === "income" ? "#fff" : "#000" }]}>
              Thu nhập
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Calculator onResult={() => {}} />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: "row",
    position: "relative",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    alignItems: "center",
    zIndex: 1,
  },
  tabText: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 18,
  },
  formContainer: {
    padding: 16,
  },
})
