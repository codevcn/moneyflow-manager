import { EmptyStateIcon, PlusIcon } from "@/components/Icons"
import { AccountRepository } from "@/configs/db/repository/account.repo"
import { useTheme } from "@/hooks/use-theme"
import { TAccount } from "@/utils/types/db/account.type"
import { useEffect, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

/**
 * Money Flow Screen - Tab "Dòng tiền"
 */
export default function MoneyFlowScreen() {
  const theme = useTheme()
  const [currentAccount, setCurrentAccount] = useState<TAccount | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccount()
  }, [])

  const loadAccount = async () => {
    try {
      const accountAdapter = new AccountRepository()
      const account = await accountAdapter.getFirst()
      setCurrentAccount(account)
    } catch (error) {
      console.error("Error loading account:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header Info */}
      <View style={[styles.accountInfo, { backgroundColor: theme.colors.surface }]}>
        <Text
          style={[
            styles.accountName,
            {
              color: theme.colors.text,
              fontSize: theme.fontSize.lg,
              fontWeight: theme.fontWeight.semibold,
            },
          ]}
        >
          {currentAccount?.name || "Đang tải..."}
        </Text>
        {currentAccount?.description && (
          <Text
            style={[
              styles.accountDescription,
              {
                color: theme.colors.textMuted,
                fontSize: theme.fontSize.sm,
              },
            ]}
          >
            {currentAccount.description}
          </Text>
        )}
      </View>

      {/* Transactions List */}
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <EmptyStateIcon size={120} color={theme.colors.textMuted} backgroundColor={theme.colors.surface} />
          <Text
            style={[
              styles.emptyText,
              {
                color: theme.colors.textMuted,
                fontSize: theme.fontSize.lg,
                marginTop: theme.spacing.md,
              },
            ]}
          >
            Chưa có giao dịch nào
          </Text>
          <Text
            style={[
              styles.emptySubtext,
              {
                color: theme.colors.textMuted,
                fontSize: theme.fontSize.sm,
                marginTop: theme.spacing.xs,
              },
            ]}
          >
            Nhấn vào nút + để thêm giao dịch đầu tiên
          </Text>
        </View>
      </View>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            {
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.text,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() => {
            // TODO: Navigate to add transaction screen
            console.log("Add transaction pressed")
          }}
        >
          <PlusIcon size={24} color="#ffffff" />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  accountInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  accountName: {
    marginBottom: 4,
  },
  accountDescription: {
    lineHeight: 18,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    textAlign: "center",
  },
  emptySubtext: {
    textAlign: "center",
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
})
