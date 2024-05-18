import { createContext } from "react";
import * as THREE from 'three'
import XRay from "./xray";


class Store {
    constructor(initialValue, webStorageName = "") {
        this.stored = initialValue
        this.webStorageName = webStorageName
        this.listeners = []

        // deserialization
        if (this.webStorageName == "") return;
        const storedStr = sessionStorage.getItem(this.webStorageName)
        if (!storedStr) return;
        const stored = JSON.parse(storedStr)
        this.stored = stored
    }

    _get() {
        return this.stored
    }

    get() {
        return this._get.bind(this)
    }

    serialized() {
        return JSON.stringify(this.stored)
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
        if (this.webStorageName == "") return
        sessionStorage.setItem(this.webStorageName, this.serialized())
    }

    emit() {
        this.listeners.forEach(f => f());
    }

};

const XRaysStoreContext = createContext(new Store([new XRay(), new XRay()], "xrays"))
const VerticesStoreContext = createContext(new Store([], "vertices"))
const ReconstructionErrorStoreContext = createContext(new Store(""))
export { XRaysStoreContext, VerticesStoreContext, ReconstructionErrorStoreContext }
