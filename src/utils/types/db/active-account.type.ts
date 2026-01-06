export type TActiveAccount = {
  account_id: number
  updated_at: number
}

export type TActiveAccountInput = {
  account_id: TActiveAccount["account_id"]
}
