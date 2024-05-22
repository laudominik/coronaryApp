import { createContext } from "react";
import Store from "../store";
import GenerationParams from "./generationParams";

const ParamsStoreContext = createContext(new Store(new GenerationParams(), "params"))
const GenerationErrorStoreContext = createContext(new Store(""))
export { ParamsStoreContext, GenerationErrorStoreContext }