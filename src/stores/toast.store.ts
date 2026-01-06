import { TToastPayload, TToastType } from "@/utils/types/global.type"
import { create } from "zustand"

type ToastState = {
  visible: boolean
  message: string
  type: TToastType
  durationMs: number
  show: (payload: TToastPayload) => void
  hide: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: "",
  type: "info",
  durationMs: 3000,

  show: ({ message, type = "info", durationMs = 3000 }) => set({ visible: true, message, type, durationMs }),

  hide: () => set({ visible: false }),
}))
