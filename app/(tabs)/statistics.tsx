import EmptyStateIcon from "@/../assets/images/icons/empty-state.svg"
import { AddTransactionButton } from "@/components/ui/AddTransactionButton"
import { useTheme } from "@/hooks/use-theme"
import { StyleSheet, Text, View } from "react-native"

/**
 * Statistics Screen - Tab "Thống kê"
 */
export default function StatisticsScreen() {
  const theme = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <EmptyStateIcon width={120} height={120} fill={theme.colors.textMuted} />
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.textMuted,
              fontSize: theme.fontSize.lg,
              marginTop: theme.spacing.md,
            },
          ]}
        >
          Tính năng đang phát triển
        </Text>
      </View>

      <AddTransactionButton />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
})
