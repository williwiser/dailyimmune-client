// contexts/AuthContext.ts
import { createContext } from "react";
import type { LogoutContextType } from "./logout";

export const ModalContext = createContext<LogoutContextType>({
  showModal: true,
  setShowModal: () => {},
});
