import CloseIcon from "@/../assets/images/icons/close-icon.svg"
import FoodDrinksIcon from "@/../assets/images/icons/food-drinks-icon.svg"
import ShoppingIcon from "@/../assets/images/icons/shopping-icon.svg"
import { palette } from "@/theme/colors"
import { TCategory } from "@/utils/types/db/category.type"
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgProps } from "react-native-svg"

const DEFAULT_DRAWER_HEIGHT: number = 400

type TCategoryItem = TCategory & {
  icon?: React.FC<SvgProps>
}

const getCategoryIcon = (categoryName: string): React.FC<SvgProps> | undefined => {
  const iconMap: Record<string, React.FC<SvgProps>> = {
    "Ăn uống": FoodDrinksIcon,
    "Mua sắm": ShoppingIcon,
  }
  return iconMap[categoryName]
}

type TRenderItemProps = {
  item: TCategoryItem
}

type TCategoryListProps = {
  categories: TCategoryItem[]
  selectedId: number | null
  onSelect: (category: TCategory) => void
  isDrawerVisible: boolean
  setIsDrawerVisible: React.Dispatch<React.SetStateAction<boolean>>
  closeDrawer: () => void
  drawerHeight?: number
  translateY?: Animated.Value
}

export const CategoryList = ({
  categories,
  selectedId,
  onSelect,
  isDrawerVisible,
  setIsDrawerVisible,
  closeDrawer,
  drawerHeight = DEFAULT_DRAWER_HEIGHT,
  translateY = new Animated.Value(DEFAULT_DRAWER_HEIGHT),
}: TCategoryListProps) => {
  const insets = useSafeAreaInsets()
  console.log('>>> [cate] categories:', categories)

  const renderItem = ({ item }: TRenderItemProps) => {
    const isSelected = item.id === selectedId
    const IconComponent = getCategoryIcon(item.name)

    return (
      <Pressable
        style={[
          styles.categoryItem,
          {
            backgroundColor: isSelected ? palette.mainCloudBlue : palette.slate50,
            borderColor: isSelected ? palette.mainBlue : palette.slate300,
          },
        ]}
        onPress={() => onSelect(item)}
      >
        {IconComponent && (
          <IconComponent width={24} height={24} color={isSelected ? palette.mainBlue : palette.slate500} />
        )}
        <Text
          style={[
            styles.categoryText,
            {
              color: isSelected ? palette.mainDarkBlue : palette.slate900,
              fontSize: 16,
              fontWeight: isSelected ? "600" : "400",
            },
          ]}
        >
          {item.name}
        </Text>
      </Pressable>
    )
  }

  return (
    <Modal visible={isDrawerVisible} transparent animationType="fade" onRequestClose={closeDrawer}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.backdrop} onPress={closeDrawer} />
        <Animated.View
          style={[
            styles.drawer,
            {
              height: drawerHeight,
              paddingBottom: insets.bottom,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.headerText,
                {
                  color: palette.slate900,
                  fontSize: 18,
                  fontWeight: "600",
                },
              ]}
            >
              Chọn danh mục
            </Text>
            <Pressable style={styles.closeButton} onPress={closeDrawer}>
              <CloseIcon width={24} height={24} color={palette.slate600} />
            </Pressable>
          </View>
          <View style={styles.container}>
            <FlatList
              data={categories}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  headerText: {
    textAlign: "center",
  },
  listContent: {
    padding: 12,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
  },
  categoryText: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    paddingHorizontal: 16,
    position: "relative",
    backgroundColor: palette.slate50,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.slate200,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: palette.slate300,
    borderRadius: 2,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 10,
    padding: 4,
  },
})
