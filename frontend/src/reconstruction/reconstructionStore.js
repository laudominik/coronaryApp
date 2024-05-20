import Store from "../store";
import { createContext } from "react";
import XRay from "../xray";

const XRaysStoreContext = createContext(new Store([new XRay(), new XRay()], "xrays"))
const VesselStoreContext = createContext(new Store([], "vessel"))
const SourcesStoreContext = createContext(new Store([], "sources"))
const CenterlineStoreContext = createContext(new Store([], "centerlines"))
const ShadowsStoreContext = createContext(new Store([], "shadows"))
const ReconstructionErrorStoreContext = createContext(new Store(""))
export { XRaysStoreContext, VesselStoreContext, SourcesStoreContext, CenterlineStoreContext, ShadowsStoreContext, ReconstructionErrorStoreContext }