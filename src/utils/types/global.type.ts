export type TToastType = "info" | "success" | "error"

export type TToastPayload = {
  message: string
  type?: TToastType
  durationMs?: number
}
