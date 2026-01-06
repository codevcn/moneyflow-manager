import { Toaster } from "@/components/ui/Toaster"
import { DatabaseBackup } from "@/configs/db/db-backup"
import { DBInitializer } from "@/configs/db/db-initializer"
import { useTheme } from "@/hooks/use-theme"
import { useFonts } from "expo-font"
import { SplashScreen, Stack } from "expo-router"
import { useEffect } from "react"
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context"

SplashScreen.preventAutoHideAsync()

/**
 * Root layout component
 */
export default function RootLayout() {
  const theme = useTheme()
  const [loaded, error] = useFonts({
    // TÊN KEY = tên fontFamily bạn sẽ dùng
    Inter: require("../assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf"),
    "Inter-Italic": require("../assets/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf"),
  })
  const insets = useSafeAreaInsets()

  const logErrorOnUseFonts = () => {
    if (error) {
      console.error(error)
    }
  }

  const initDatabase = async () => {
    try {
      // Try to connect
      const dbInitializer = new DBInitializer()
      await dbInitializer.initialize() // đã khởi tạo rawDB bên trong

      console.log(">>> run this")
      await DatabaseBackup.exportDBFileToLocalServer()

      console.log(">>> [init] Inited db")
    } catch (err) {
      console.error(">>> [init] Database init failed:", err)
    }
  }

  const hideSplashScreen = async () => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }

  useEffect(logErrorOnUseFonts, [error])

  useEffect(() => {
    hideSplashScreen()
  }, [loaded])

  useEffect(() => {
    initDatabase()
    // doTest()
  }, [])

  if (!loaded) return null

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        }}
      />
      <Toaster />
    </SafeAreaProvider>
  )
}
