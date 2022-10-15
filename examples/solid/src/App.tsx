import type { Component } from "solid-js";
import HexEditor from "./HexEditor/HexEditor";

const App: Component = () => {
    return (
        <main class="flex flex-col h-screen items-center justify-center bg-[rgb(50,50,50)] text-white">
            <div class="min-h-fit overflow-hidden">
                <HexEditor
                    data={new Uint8Array(524_288)
                        .fill(0x00)
                        .map(() => Math.floor(Math.random() * 256))}
                    visibleRows={32}
                ></HexEditor>
            </div>
        </main>
    );
};

export default App;
