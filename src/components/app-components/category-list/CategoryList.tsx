import CloseIcon from "@/../assets/images/icons/close-icon.svg"
import { palette } from "@/theme/colors"
import { mapPathToSvgComponent } from "@/utils/data/svg-mappings"
import { TCategory } from "@/utils/types/db/category.type"
import { Animated, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const DEFAULT_DRAWER_HEIGHT: number = 400

type TCategoryIconProps = {
  iconPath: string
  categoryIsSelected?: boolean
}

const CategoryIcon = ({ iconPath, categoryIsSelected }: TCategoryIconProps) => {
  const SvgComponent = mapPathToSvgComponent(iconPath)
  if (SvgComponent) {
    return <SvgComponent width={24} height={24} color={categoryIsSelected ? palette.mainBlue : undefined} />
  }
  return <></>
}

type TRenderItemProps = {
  item: TCategory
}

type TCategoryListProps = {
  categories: TCategory[]
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

  const renderItem = ({ item }: TRenderItemProps) => {
    const isSelected = item.id === selectedId
    return (
      <Pressable
        style={[
          styles.categoryItem,
          {
            backgroundColor: isSelected ? palette.slate50 : palette.slate50,
            borderColor: isSelected ? palette.mainBlue : palette.slate300,
          },
        ]}
        onPress={() => onSelect(item)}
      >
        <CategoryIcon iconPath={item.icon_path} categoryIsSelected={isSelected} />
        <Text
          style={[
            styles.categoryText,
            {
              color: isSelected ? palette.mainBlue : palette.slate900,
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
              numColumns={2}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              columnWrapperStyle={styles.row}
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
    flexDirection: "row",
    flex: 1,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
    width: "100%",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    flexGrow: 1,
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
