import { createContext } from "react";
import * as THREE from 'three'
import XRay from "./xray";

class Store {
    constructor() {
        // TODO: deserialize
        this.previewMouseLocked = false;
        this.listeners = [];
        this.xrays = [new XRay(), new XRay()]
        this.vertices = []
    }

    _getXRays() {
        return this.xrays
    }

    getXRays() {
        return this._getXRays.bind(this)
    }

    _getVertices() {
        return this.vertices
    }

    getVertices() {
        return this._getVertices.bind(this)
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

    setXRays(newXRays) {
        this.xrays = newXRays
        this.emit()
    }

    setVertices(newVertices) {
        this.vertices = newVertices
        this.emit()
    }

    emit() {
        this.listeners.forEach(f => f());
        // TODO: serialize
    }

};

const StoreContext = createContext(new Store())
export { StoreContext }
