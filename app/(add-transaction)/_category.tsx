import LabelIcon from "@/../assets/images/icons/label-icon.svg"
import { CategoryList } from "@/components/app-components/category-list/CategoryList"
import { CategoryRepository } from "@/configs/db/repository/category.repo"
import { palette } from "@/theme/colors"
import { mapPathToSvgComponent } from "@/utils/data/svg-mappings"
import { TCategory } from "@/utils/types/db/category.type"
import { useEffect, useState } from "react"
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from "react-native"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")
const DRAWER_HEIGHT = SCREEN_HEIGHT * 0.6

type TCategoryProps = {
  selectedCategoryId: TCategory["id"] | null
  onCategorySelect: (categoryId: TCategory["id"] | null) => void
}

export const Category = ({ selectedCategoryId, onCategorySelect }: TCategoryProps) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const [categories, setCategories] = useState<TCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<TCategory | null>(null)
  const [translateY] = useState(new Animated.Value(DRAWER_HEIGHT))

  useEffect(() => {
    loadCategories()
  }, [isDrawerVisible])

  useEffect(() => {
    if (selectedCategoryId && categories.length > 0) {
      const category = categories.find((c) => c.id === selectedCategoryId)
      setSelectedCategory(category || null)
    } else {
      setSelectedCategory(null)
    }
  }, [selectedCategoryId, categories])

  const loadCategories = async () => {
    try {
      const categoryRepo = new CategoryRepository()
      const data = await categoryRepo.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const openDrawer = () => {
    setIsDrawerVisible(true)
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 10,
    }).start()
  }

  const closeDrawer = () => {
    Animated.timing(translateY, {
      toValue: DRAWER_HEIGHT,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setIsDrawerVisible(false)
    })
  }

  const handleCategorySelect = (category: TCategory) => {
    setSelectedCategory(category)
    onCategorySelect(category.id)
    closeDrawer()
  }

  const SvgComponent = mapPathToSvgComponent(selectedCategory?.icon_path || "")

  return (
    <View style={styles.container}>
      <View style={styles.category}>
        <Pressable style={[styles.button, selectedCategory ? { flex: 1 } : {}]} onPress={openDrawer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <LabelIcon
              width={24}
              height={24}
              color={palette.mainCloudBlue}
              strokeWidth={3}
              fill={palette.mainDarkBlue}
            />
            <Text style={styles.text}>Danh mục</Text>
          </View>
          {selectedCategory && SvgComponent && (
            <View style={styles.selectedCategory}>
              <SvgComponent width={24} height={24} color="#fff" strokeWidth={2.5} />
              <Text style={styles.selectedCategoryText}>{selectedCategory.name}</Text>
            </View>
          )}
        </Pressable>
      </View>
      <CategoryList
        categories={categories}
        selectedId={selectedCategoryId}
        onSelect={handleCategorySelect}
        isDrawerVisible={isDrawerVisible}
        setIsDrawerVisible={setIsDrawerVisible}
        closeDrawer={closeDrawer}
        drawerHeight={DRAWER_HEIGHT}
        translateY={translateY}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 4,
    paddingTop: 8,
  },
  category: {
    flexDirection: "row",
    gap: 8,
    alignItems: "stretch",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    flexGrow: 1,
    paddingLeft: 16,
    paddingRight: 2,
    borderWidth: 2,
    height: 50,
    borderColor: palette.slate300,
    borderRadius: 8,
    backgroundColor: palette.mainCloudBlue,
  },
  selectedCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexGrow: 1,
    justifyContent: "center",
    borderColor: palette.mainBlue,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: palette.mainBlue,
    height: 40,
  },
  selectedCategoryText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  text: {
    color: palette.mainDarkBlue,
    fontSize: 18,
    fontWeight: "600",
  },
})
