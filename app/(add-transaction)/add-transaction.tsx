import CheckIcon from "@/../assets/images/icons/check-icon.svg"
import { AccountRepository } from "@/configs/db/repository/account.repo"
import { TransactionRepository } from "@/configs/db/repository/transaction.repo"
import { MESSAGES } from "@/constants/messages"
import { palette } from "@/theme/colors"
import { getCurrentTimeString, getCurrentTimestamp } from "@/utils/formatters"
import { ToasterControl } from "@/utils/toaster.control"
import { TAccount } from "@/utils/types/db/account.type"
import { TTransactionType } from "@/utils/types/db/transaction.type"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Alert, Dimensions, KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from "react-native"
import { Calculator } from "./_calculator"
import { Category } from "./_category"
import { Description } from "./_description"

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
  const scrollViewRef = useRef<any>(null)
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
      ToasterControl.show("Không thể tải thông tin tài khoản", "error")
      router.back()
    }
  }

  const handleTabPress = (tab: TTransactionType) => {
    setActiveTab(tab)
    const offsetX = tab === "expense" ? 0 : SCREEN_WIDTH
    scrollViewRef.current?.scrollTo({ x: offsetX, animated: true })
  }

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
      ToasterControl.show("Vui lòng kiểm tra lại thông tin", "error")
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
          onPress: () => router.push("/"),
        },
      ])
    } catch (error) {
      console.error("Error creating transaction:", error)
      ToasterControl.show(MESSAGES.ERROR.CREATE_TRANSACTION_FAILED, "error")
    } finally {
      setLoading(false)
    }
  }

  const updateExpenseForm = (field: keyof TFormData, value: string | number) => {
    setExpenseForm({ ...expenseForm, [field]: value })
    setExpenseErrors({ ...expenseErrors, [field]: undefined })
  }

  const updateIncomeForm = (field: keyof TFormData, value: string | number) => {
    setIncomeForm({ ...incomeForm, [field]: value })
    setIncomeErrors({ ...incomeErrors, [field]: undefined })
  }

  const handleUpdateAmount = (value: string) => {
    if (activeTab === "expense") {
      updateExpenseForm("amount", value)
    } else {
      updateIncomeForm("amount", value)
    }
  }

  const handleUpdateDescription = (text: string) => {
    if (activeTab === "expense") {
      updateExpenseForm("description", text)
    } else {
      updateIncomeForm("description", text)
    }
  }

  const handleCategorySelect = (categoryId: number | null) => {
    if (activeTab === "expense") {
      updateExpenseForm("categoryId", categoryId || 0)
    } else {
      updateIncomeForm("categoryId", categoryId || 0)
    }
  }

  const currentForm = activeTab === "expense" ? expenseForm : incomeForm
  const isExpenseTab = activeTab === "expense"
  const isIncomeTab = activeTab === "income"

  return (
    <KeyboardAvoidingView style={[styles.container]} behavior="height">
      <View style={[styles.header]}>
        <View style={[styles.tabContainer]}>
          <Pressable
            style={[
              styles.tab,
              {
                backgroundColor: isExpenseTab ? "#ff4d4f" : palette.slate50,
                borderTopColor: isExpenseTab ? "#ff4d4f" : palette.slate300,
                borderLeftColor: isExpenseTab ? "#ff4d4f" : palette.slate300,
                borderRightColor: isExpenseTab ? "#ff4d4f" : palette.slate300,
              },
            ]}
            onPress={() => handleTabPress("expense")}
          >
            {isExpenseTab ? <CheckIcon height={24} width={24} color="#fff" /> : null}
            <Text style={[styles.tabText, { color: isExpenseTab ? "#fff" : "#000" }]}>Chi tiêu</Text>
          </Pressable>

          <Pressable
            style={[styles.tab, { backgroundColor: isIncomeTab ? palette.mainBlue : palette.slate50 }]}
            onPress={() => handleTabPress("income")}
          >
            {isIncomeTab ? <CheckIcon height={24} width={24} color="#fff" /> : null}
            <Text style={[styles.tabText, { color: isIncomeTab ? "#fff" : "#000" }]}>Thu nhập</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Category selectedCategoryId={currentForm.categoryId} onCategorySelect={handleCategorySelect} />
        <Description onContentChange={handleUpdateDescription} />
        <Calculator onCurrentValueChange={handleUpdateAmount} />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    borderBottomColor: "#ccc",
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  tabContainer: {
    flexDirection: "row",
    position: "relative",
    backgroundColor: "#fff",
    gap: 8,
    paddingHorizontal: 8,
  },
  tab: {
    borderColor: palette.slate300,
    borderWidth: 1,
    borderBottomWidth: 4,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    alignItems: "center",
    zIndex: 1,
    backgroundColor: palette.slate50,
    borderRadius: 8,
  },
  expenseTab: {},
  tabText: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: 18,
  },
})
