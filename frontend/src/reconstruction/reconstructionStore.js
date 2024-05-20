import Store from "../store";
import { createContext } from "react";
import XRay from "../xray";

const XRaysStoreContext = createContext(new Store([new XRay(), new XRay()], "xrays"))
const VerticesStoreContext = createContext(new Store([], "vertices"))
const ReconstructionErrorStoreContext = createContext(new Store(""))
export { XRaysStoreContext, VerticesStoreContext, ReconstructionErrorStoreContext }