export type TAccount = {
  id: number
  name: string
  description: string | null
  created_at: number
  updated_at: number
}

export type TAccountInput = {
  name: string
  description?: string
}

export type TAccountUpdate = {
  id: number
  name?: string
  description?: string | null
}
