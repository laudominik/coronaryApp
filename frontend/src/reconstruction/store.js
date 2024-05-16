import { createContext } from "react";
import XRay from "./xray";

class Store {
    constructor() {
        // TODO: deserialize
        this.previewMouseLocked = false;
        this.listeners = [];
        this.xrays = [new XRay(), new XRay()]
    }

    _get(ix) {
        return this.xrays
    }

    get() {
        return this._get.bind(this);
    }

    subscribe() {
        return this._subscribe.bind(this);
    }

    _subscribe(listener) {
        this.listeners = [...this.listeners, listener]
        return () => {
            this.listeners = this.listeners.filter(l => l != listener);
        };
    }

    set(newXrays) {
        this.xrays = newXrays
        this.emit()
    }

    emit() {
        this.listeners.forEach(f => f());
        // TODO: serialize
    }

};

const StoreContext = createContext(new Store())
export { StoreContext }
