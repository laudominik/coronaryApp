import Store from "../../store";
import { createContext } from "react";
import XRay from "../../xray";

// input
const XRaysStoreContext = createContext(new Store([new XRay(), new XRay()], "xrays"))

// output
const VesselStoreContext = createContext(new Store([], "vessel"))
const CenterlineStoreContext = createContext(new Store([], "centerlines"))
const BifurcationStoreContext = createContext(new Store([], "bifurcations"))

// for better visualization
const SourcesStoreContext = createContext(new Store([], "sources"))
const ShadowsStoreContext = createContext(new Store([], "shadows"))
const RectsStoreContext = createContext(new Store([], "rects"))

const ReconstructionErrorStoreContext = createContext(new Store(""))
export { XRaysStoreContext, VesselStoreContext, SourcesStoreContext, CenterlineStoreContext, BifurcationStoreContext, ShadowsStoreContext, ReconstructionErrorStoreContext, RectsStoreContext }