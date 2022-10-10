import HexEditor from "./HexEditor/HexEditor";

function App() {
    return (
        <div className="flex flex-col h-screen items-center justify-center bg-[rgb(50,50,50)] text-white">
            <div className="h-96">
                <HexEditor {...{ data: new Uint8Array(524_288 / 512) }}></HexEditor>
            </div>
        </div>
    );
}

export default App;
