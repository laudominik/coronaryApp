import { createContext } from "react";
import Store from "../store";

const ParamsStoreContext = createContext(new Store([], "params"))
export { ParamsStoreContext }