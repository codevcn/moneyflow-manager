import { AccountRepository } from "@/configs/db/repository/account.repo"
import { ActiveAccountRepository } from "@/configs/db/repository/active-account.repo"
import { useTheme } from "@/hooks/use-theme"
import { useAccountStore } from "@/stores/account.store"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, StyleSheet, View } from "react-native"

/**
 * Index page - Điều hướng dựa trên trạng thái account
 */
export default function Index() {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const fetchActiveAccount = async () => {
    try {
      const activeAccountRepo = new ActiveAccountRepository()
      const activeAccount = await activeAccountRepo.getActiveAccount()
      const accountRepo = new AccountRepository()
      const account = await accountRepo.getById(activeAccount.account_id)
      useAccountStore.getState().setActiveAccount(account)
      console.log(">>> ✅ Fetch active account successful")
    } catch (error) {
      console.error(">>> ❌ Fetch active account failed:", error)
    }
  }

  const checkAccount = async () => {
    setLoading(true)
    try {
      const accountAdapter = new AccountRepository()
      const count = await accountAdapter.count()

      if (count > 0) {
        await fetchActiveAccount()
        router.replace("/(tabs)/money-flow" as any)
      } else {
        router.replace("/onboarding" as any)
      }
    } catch (error) {
      console.error("Error checking accounts:", error)
      router.replace("/onboarding" as any)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAccount()
    return () => {
      setLoading(false)
    }
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
