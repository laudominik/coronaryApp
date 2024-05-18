import { createContext } from "react";
import * as THREE from 'three'
import XRay from "./xray";


class Store {
    constructor(initial_value) {
        // TODO: deserialize
        this.stored = initial_value
        this.listeners = []
    }

    _get() {
        return this.stored
    }

    get() {
        return this._get.bind(this)
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

    set(newStored) {
        this.stored = newStored
        this.emit()
    }

    emit() {
        this.listeners.forEach(f => f());
    }

};

const XRaysStoreContext = createContext(new Store([new XRay(), new XRay()]))
const VerticesStoreContext = createContext(new Store())
export { XRaysStoreContext, VerticesStoreContext }
