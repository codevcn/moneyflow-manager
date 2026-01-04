export type TTransactionType = "income" | "expense"

export type TTransaction = {
  id: number
  account_id: number
  category_id: number | null
  type: TTransactionType
  amount: number
  description: string | null
  transaction_date: number
  transaction_time: string
  created_at: number
  updated_at: number
}

export type TTransactionInput = {
  account_id: number
  category_id?: number | null
  type: TTransactionType
  amount: number
  description?: string
  transaction_date: number
  transaction_time: string
}

export type TTransactionUpdate = {
  id: number
  category_id?: number | null
  type?: TTransactionType
  amount?: number
  description?: string | null
  transaction_date?: number
  transaction_time?: string
}
