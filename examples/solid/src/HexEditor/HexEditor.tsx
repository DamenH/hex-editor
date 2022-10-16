import { createSignal } from "solid-js";
import { HexBuffer } from "../utils/hex";

import HexGrid from "./HexGrid";
import Scrollbar from "./Scrollbar";

interface HexEditorProps {
    data: Uint8Array;
    visibleRows: number;
}

const COLUMNS = 16;

function HexEditor({ data, visibleRows }: HexEditorProps) {
    const [scrollIndex, setScrollIndex] = createSignal(0);

    const [hexData] = createSignal(new HexBuffer(data));

    return (
        <div class="flex flex-col w-min h-full bg-[rgb(30,30,30)] ring-1 ring-neutral-700 font-mono cursor-default select-none">
            <div class="flex flex-row items-center border-b border-neutral-700">
                <div class="flex flex-row items-center h-4 ml-1 w-[52px] mr-[11px]"></div>
                <ul class="flex flex-row justify-end space-x-[10px] mr-[6px] font-medium">
                    {Array(COLUMNS)
                        .fill(null)
                        .map((_, i) => (
                            <li>{`0${i.toString(16)}`.slice(-2).toUpperCase()}</li>
                        ))}
                </ul>
            </div>
            <div class="flex flex-row h-auto">
                <HexGrid
                    data={hexData()}
                    visibleRows={visibleRows}
                    columns={COLUMNS}
                    scrollIndex={scrollIndex()}
                ></HexGrid>
                <Scrollbar
                    totalRows={data.length / COLUMNS}
                    visibleRows={visibleRows}
                    rowHeight={21}
                    onScroll={(index) => {
                        setScrollIndex(index);
                    }}
                ></Scrollbar>
            </div>
            <div class="w-full border-t bg-[rgb(30,30,30)] border-neutral-700">
                <code>ScrollIndex: {`00000${scrollIndex()}`.slice(-5)};&nbsp;</code>
            </div>
        </div>
    );
}

export default HexEditor;
