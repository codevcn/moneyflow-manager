import { TTransactionType } from "./transaction.type"

export type TCategory = {
  id: number
  account_id: number
  name: string
  type: TTransactionType
  created_at: number
  updated_at: number
}

export type TCategoryInput = {
  account_id: number
  name: string
  type: TTransactionType
}

export type TCategoryUpdate = {
  id: number
  name?: string
}
