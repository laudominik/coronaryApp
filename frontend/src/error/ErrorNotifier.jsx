import { useSyncExternalStore } from "react";

export default function ErrorNotifier({errorContext}) {
    const error = useSyncExternalStore(errorContext.subscribe(), errorContext.get())

    return (
        error === "" ? <></> :
        <div className="error-notifier__wrapper">
            <span className="error-notifier__text">!</span>
        </div>
        
    );
}