import { createContext, useContext } from "react";

export const NotifContext = createContext(null)

export const useNotif = () => useContext(NotifContext);