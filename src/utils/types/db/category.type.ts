export type TCategory = {
  id: number
  name: string
  icon_path: string
  created_at: number
}

export type TCategoryInput = {
  name: string
  icon_path: string
}

export type TCategoryUpdate = {
  id: number
  name?: string
  icon_path?: string
}
