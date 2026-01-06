import { useToastStore } from "@/stores/toast.store"
import { TToastType } from "./types/global.type"

export class ToasterControl {
  static show(message: string, type: TToastType = "info", durationMs: number = 2200) {
    useToastStore.getState().show({ message, type, durationMs })
  }
  static hide() {
    useToastStore.getState().hide()
  }
}
