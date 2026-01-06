import { SvgProps } from "react-native-svg"

type TSvgFC = React.FC<SvgProps>

const svgMappings: Record<string, TSvgFC> = {
  "images/icons/food-drinks-icon": require("../../../assets/images/icons/food-drinks-icon.svg").default,
  "images/icons/shopping-icon": require("../../../assets/images/icons/shopping-icon.svg").default,
}

export const mapPathToSvgComponent = (pathFromImagesFolderAsset: string): TSvgFC | null => {
  return svgMappings[pathFromImagesFolderAsset] || null
}
