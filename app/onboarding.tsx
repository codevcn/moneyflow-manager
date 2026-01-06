import MoneyFlowIcon from "@/../assets/images/icons/money-flow-icon.svg"
import { Button } from "@/components/materials/Button"
import { TextField } from "@/components/materials/TextField"
import { AccountSettingsRepository } from "@/configs/db/repository/account-settings.repo"
import { AccountRepository } from "@/configs/db/repository/account.repo"
import { ActiveAccountRepository } from "@/configs/db/repository/active-account.repo"
import { MESSAGES } from "@/constants/messages"
import { useTheme } from "@/hooks/use-theme"
import { useAccountStore } from "@/stores/account.store"
import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native"
/**
 * Onboarding Screen - Tạo account đầu tiên
 */
export default function OnboardingScreen() {
  const theme = useTheme()
  const [accountName, setAccountName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateAccount = async () => {
    // Validation
    if (!accountName.trim()) {
      setError(MESSAGES.VALIDATION.ACCOUNT_NAME_REQUIRED)
      return
    }

    setLoading(true)
    setError("")

    try {
      const accountRepo = new AccountRepository()
      const settingsRepo = new AccountSettingsRepository()
      const activeAccountRepo = new ActiveAccountRepository()

      // Create account
      const account = await accountRepo.create({
        name: accountName.trim(),
        description: description.trim() || undefined,
      })

      await activeAccountRepo.replaceActiveAccount({ account_id: account.id })

      useAccountStore.getState().setActiveAccount(account)

      // Create default settings for account
      await settingsRepo.create({
        account_id: account.id,
      })

      // Navigate to main screen
      router.replace("/(tabs)/money-flow" as any)
    } catch (err) {
      console.error("Error creating account:", err)
      setError(MESSAGES.ERROR.CREATE_ACCOUNT_FAILED)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <MoneyFlowIcon width={80} height={80} color={theme.colors.primary} />
            </View>

            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text,
                  fontSize: theme.fontSize["2xl"],
                  fontWeight: theme.fontWeight.bold,
                },
              ]}
            >
              {MESSAGES.ONBOARDING.TITLE}
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.fontSize.md,
                },
              ]}
            >
              {MESSAGES.ONBOARDING.SUBTITLE}
            </Text>

            <Text
              style={[
                styles.instruction,
                {
                  color: theme.colors.text,
                  fontSize: theme.fontSize.lg,
                  fontWeight: theme.fontWeight.medium,
                },
              ]}
            >
              {MESSAGES.ONBOARDING.CREATE_FIRST_ACCOUNT}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextField
              label="Tên tài khoản *"
              placeholder={MESSAGES.ONBOARDING.ACCOUNT_NAME_PLACEHOLDER}
              value={accountName}
              onChangeText={(text) => {
                setAccountName(text)
                setError("")
              }}
              error={error}
              autoFocus
            />

            <TextField
              label="Mô tả tài khoản"
              placeholder={MESSAGES.ONBOARDING.ACCOUNT_DESCRIPTION_PLACEHOLDER}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={{ minHeight: 80 }}
            />

            <Button
              title={MESSAGES.ONBOARDING.BUTTON_CREATE}
              onPress={handleCreateAccount}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 24,
  },
  instruction: {
    textAlign: "center",
  },
  form: {
    gap: 8,
  },
})
