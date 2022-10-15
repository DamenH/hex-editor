import HexEditor from "./HexEditor/HexEditor";

function App() {
    return (
        <main className="flex flex-col h-screen items-center justify-center bg-[rgb(50,50,50)] text-white">
            <div className="min-h-fit overflow-hidden">
                <HexEditor
                    {...{
                        data: new Uint8Array(524_288)
                            .fill(0x00)
                            .map(() => Math.floor(Math.random() * 256)),
                        visibleRows: 32,
                    }}
                ></HexEditor>
            </div>
        </main>
    );
}

export default App;
