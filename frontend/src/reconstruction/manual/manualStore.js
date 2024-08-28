import Store from "../../store";
import { createContext } from "react";
import XRay from "../../xray";

// input
const XRaysStoreContext = createContext(new Store([new XRay(), new XRay()], "manual_xrays"))
const CanvasStoreContext = createContext(new Store({lines: [], points: []}, "manual_canvas"))
const ColorsStoreContext = createContext(new Store({point: "#00FF00", line: "#FF0000"}, "manual_colors"))

const ManualErrorStoreContext = createContext(new Store(""))
export { XRaysStoreContext, CanvasStoreContext, ManualErrorStoreContext, ColorsStoreContext }