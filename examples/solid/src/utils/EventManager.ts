export class EventManager {
    private static subscriptions = new Map<string, Map<symbol, (event: any) => unknown>>();

    static subscribe(name: string, key: symbol, listener: (event: any) => unknown) {
        if (!this.subscriptions.has(name)) {
            this.subscriptions.set(name, new Map().set(key, listener));
            function handler(e: any) {
                EventManager.subscriptions.get(name)!.forEach((listener) => listener(event));
            };
            addEventListener(name, handler);
            return;
        }

        this.subscriptions.get(name)!.set(key, listener);
    }

    static unsubscribe(event: string, key: symbol) {
        this.subscriptions.get(event)?.delete(key);
    }
}
