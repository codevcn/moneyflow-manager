import { TAccount } from "@/utils/types/db/account.type"
import { create } from "zustand"

type TUseAccountStore = {
  activeAccount: TAccount | null

  setActiveAccount: (account: TAccount | null) => void
}

export const useAccountStore = create<TUseAccountStore>((set) => ({
  activeAccount: null,

  setActiveAccount: (account: TAccount | null) => set({ activeAccount: account }),
}))
