import PlusIcon from "@/../assets/images/icons/plus-icon.svg"
import { CategoryRepository } from "@/configs/db/repository/category.repo"
import { useTheme } from "@/hooks/use-theme"
import { TCategory } from "@/utils/types/db/category.type"
import { TTransactionType } from "@/utils/types/db/transaction.type"
import { TAppTheme } from "@/utils/types/theme.type"
import { useEffect, useState } from "react"
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"

type TCategoryPickerProps = {
  label?: string
  accountId: number
  type: TTransactionType
  selectedCategoryId?: number | null
  onSelect: (categoryId: number | null) => void
  error?: string
}

function createStyles(theme: TAppTheme) {
  return StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    label: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.md,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    button: {
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 14,
      minHeight: 56,
      justifyContent: "center",
    },
    buttonError: {
      borderColor: theme.colors.danger,
    },
    buttonPressed: {
      opacity: 0.7,
    },
    buttonText: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
    },
    placeholder: {
      color: theme.colors.textMuted,
    },
    error: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.sm,
      color: theme.colors.danger,
      marginTop: theme.spacing.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
      paddingTop: theme.spacing.md,
      maxHeight: "70%",
    },
    modalHeader: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.xl,
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    },
    categoryList: {
      padding: theme.spacing.md,
    },
    categoryItem: {
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background,
    },
    categoryItemSelected: {
      backgroundColor: theme.colors.primary,
    },
    categoryItemText: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
    },
    categoryItemTextSelected: {
      color: "#ffffff",
      fontWeight: theme.fontWeight.semibold,
    },
    addButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.primary,
    },
    addButtonText: {
      fontFamily: "Inter",
      fontSize: theme.fontSize.lg,
      color: "#ffffff",
      fontWeight: theme.fontWeight.semibold,
      marginLeft: theme.spacing.sm,
    },
    newCategoryInput: {
      backgroundColor: theme.colors.background,
      borderWidth: 2,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 12,
      marginBottom: theme.spacing.sm,
      fontFamily: "Inter",
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
    },
  })
}

export function CategoryPicker({
  label,
  accountId,
  type,
  selectedCategoryId,
  onSelect,
  error,
}: TCategoryPickerProps) {
  const theme = useTheme()
  const styles = createStyles(theme)
  const [showModal, setShowModal] = useState(false)
  const [categories, setCategories] = useState<TCategory[]>([])
  const [showNewInput, setShowNewInput] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId)

  useEffect(() => {
    if (showModal) {
      loadCategories()
    }
  }, [showModal, type])

  const loadCategories = async () => {
    try {
      const repo = new CategoryRepository()
      const data = await repo.getByType(accountId, type)
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên danh mục")
      return
    }

    setLoading(true)
    try {
      const repo = new CategoryRepository()
      const exists = await repo.exists(accountId, newCategoryName.trim(), type)

      if (exists) {
        Alert.alert("Lỗi", "Danh mục này đã tồn tại")
        setLoading(false)
        return
      }

      const newCategory = await repo.create({
        account_id: accountId,
        name: newCategoryName.trim(),
        type,
      })

      setCategories([...categories, newCategory])
      onSelect(newCategory.id)
      setNewCategoryName("")
      setShowNewInput(false)
      setShowModal(false)
    } catch (error) {
      console.error("Error creating category:", error)
      Alert.alert("Lỗi", "Không thể tạo danh mục")
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCategory = (categoryId: number) => {
    onSelect(categoryId)
    setShowModal(false)
  }

  const handlePress = () => {
    setShowModal(true)
  }

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={({ pressed }) => [styles.button, error && styles.buttonError, pressed && styles.buttonPressed]}
        onPress={handlePress}
      >
        <Text style={[styles.buttonText, !selectedCategory && styles.placeholder]}>
          {selectedCategory ? selectedCategory.name : "Chọn danh mục"}
        </Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal transparent animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn danh mục</Text>
            </View>

            <ScrollView style={styles.categoryList} showsVerticalScrollIndicator={false}>
              {!showNewInput && (
                <Pressable style={styles.addButton} onPress={() => setShowNewInput(true)}>
                  <PlusIcon width={20} height={20} color="#ffffff" />
                  <Text style={styles.addButtonText}>Thêm danh mục mới</Text>
                </Pressable>
              )}

              {showNewInput && (
                <View>
                  <TextInput
                    style={styles.newCategoryInput}
                    placeholder="Nhập tên danh mục mới"
                    placeholderTextColor={theme.colors.textMuted}
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    autoFocus
                  />
                  <View style={{ flexDirection: "row", gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
                    <Pressable
                      style={{
                        flex: 1,
                        backgroundColor: theme.colors.primary,
                        padding: 12,
                        borderRadius: theme.radius.md,
                        alignItems: "center",
                      }}
                      onPress={handleAddNewCategory}
                      disabled={loading}
                    >
                      <Text style={{ color: "#ffffff", fontWeight: theme.fontWeight.semibold }}>Lưu</Text>
                    </Pressable>
                    <Pressable
                      style={{
                        flex: 1,
                        backgroundColor: theme.colors.border,
                        padding: 12,
                        borderRadius: theme.radius.md,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setShowNewInput(false)
                        setNewCategoryName("")
                      }}
                    >
                      <Text style={{ color: theme.colors.text, fontWeight: theme.fontWeight.semibold }}>Hủy</Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[styles.categoryItem, category.id === selectedCategoryId && styles.categoryItemSelected]}
                  onPress={() => handleSelectCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      category.id === selectedCategoryId && styles.categoryItemTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
