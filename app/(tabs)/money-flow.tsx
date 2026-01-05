import EmptyStateIcon from "@/../assets/images/icons/empty-state.svg"
import { AddTransactionButton } from "@/components/ui/AddTransactionButton"
import { DatabaseBackup } from "@/configs/db/db-backup"
import { AccountRepository } from "@/configs/db/repository/account.repo"
import { TransactionRepository } from "@/configs/db/repository/transaction.repo"
import { useTheme } from "@/hooks/use-theme"
import { formatCurrency, formatDate } from "@/utils/formatters"
import { TAccount } from "@/utils/types/db/account.type"
import { TTransaction } from "@/utils/types/db/transaction.type"
import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"

type TGroupedTransaction = {
  date: number
  transactions: TTransaction[]
}

/**
 * Money Flow Screen - Tab "Dòng tiền"
 */
export default function MoneyFlowScreen() {
  const theme = useTheme()
  const [currentAccount, setCurrentAccount] = useState<TAccount | null>(null)
  const [transactions, setTransactions] = useState<TGroupedTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAccount()
    exportDBToServer()
  }, [])

  useFocusEffect(
    useCallback(() => {
      if (currentAccount) {
        loadTransactions()
      }
    }, [currentAccount])
  )

  const exportDBToServer = async () => {
    console.log(">>> Exporting database to local server...")
    try {
      await DatabaseBackup.exportDBFileToLocalServer()
      console.log(">>> Database exported to local server successfully")
    } catch (error) {
      console.error(">>> Error exporting database to local server:", error)
    }
  }

  const loadAccount = async () => {
    try {
      const accountRepo = new AccountRepository()
      const account = await accountRepo.getFirst()
      setCurrentAccount(account)
    } catch (error) {
      console.error("Error loading account:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadTransactions = async () => {
    if (!currentAccount) return

    try {
      const transactionRepo = new TransactionRepository()
      const data = await transactionRepo.getByAccountId(currentAccount.id)

      const grouped = groupTransactionsByDate(data)
      setTransactions(grouped)
    } catch (error) {
      console.error("Error loading transactions:", error)
    }
  }

  const groupTransactionsByDate = (data: TTransaction[]): TGroupedTransaction[] => {
    const grouped = data.reduce((acc, transaction) => {
      const dateKey = transaction.transaction_date
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(transaction)
      return acc
    }, {} as Record<number, TTransaction[]>)

    return Object.entries(grouped)
      .map(([date, transactions]) => ({
        date: parseInt(date),
        transactions,
      }))
      .sort((a, b) => b.date - a.date)
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
      {transactions.length === 0 ? (
        <View style={styles.content}>
          <View style={styles.emptyState}>
            <EmptyStateIcon width={96} height={96} fill={theme.colors.primary} />
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
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.date.toString()}
          renderItem={({ item }) => (
            <View style={[styles.dateGroup, { backgroundColor: theme.colors.surface }]}>
              <Text
                style={[
                  styles.dateHeader,
                  {
                    color: theme.colors.text,
                    fontSize: theme.fontSize.md,
                    fontWeight: theme.fontWeight.semibold,
                  },
                ]}
              >
                {formatDate(item.date)}
              </Text>
              {item.transactions.map((transaction) => (
                <View
                  key={transaction.id}
                  style={[styles.transactionItem, { backgroundColor: theme.colors.background }]}
                >
                  <View style={styles.transactionInfo}>
                    <Text
                      style={[
                        styles.transactionAmount,
                        {
                          fontSize: theme.fontSize.lg,
                          fontWeight: theme.fontWeight.bold,
                          color: transaction.type === "income" ? theme.colors.success : theme.colors.danger,
                        },
                      ]}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </Text>
                    {transaction.description && (
                      <Text
                        style={[
                          styles.transactionDescription,
                          {
                            color: theme.colors.textMuted,
                            fontSize: theme.fontSize.sm,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {transaction.description}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.transactionTime,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.fontSize.sm,
                      },
                    ]}
                  >
                    {transaction.transaction_time}
                  </Text>
                </View>
              ))}
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      <AddTransactionButton />
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
  dateGroup: {
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 12,
  },
  dateHeader: {
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    fontFamily: "Inter",
  },
  transactionDescription: {
    marginTop: 4,
  },
  transactionTime: {
    marginLeft: 8,
  },
})
