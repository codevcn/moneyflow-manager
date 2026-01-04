import PlusIcon from "@/../assets/images/icons/plus-icon.svg"
import { useTheme } from "@/hooks/use-theme"
import { router } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"

// Floating Action Button để thêm giao dịch mới
export const AddTransactionButton = () => {
  const theme = useTheme()

  const handlePress = () => {
    router.push("/add-transaction" as any)
  }

  return (
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
        onPress={handlePress}
      >
        <PlusIcon width={24} height={24} color="#ffffff" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    right: 24,
    bottom: 24,
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
