import { DBInitializer } from "@/configs/db/db-initializer"
import { useTheme } from "@/hooks/use-theme"
import { useFonts } from "expo-font"
import { SplashScreen, Stack } from "expo-router"
import { useEffect } from "react"

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

  useEffect(() => {
    if (error) {
      console.error(error)
    }
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  useEffect(() => {
    const initDatabase = async () => {
      try {
        // Try to connect
        const dbInitializer = new DBInitializer()
        await dbInitializer.initialize()

        console.log(">>> [init] Inited db")
      } catch (err) {
        console.error(">>> [init] Database init failed:", err)
      }
    }

    initDatabase()
  }, [])

  if (!loaded) return null

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: theme.colors.background,
        },
      }}
    />
  )
}
