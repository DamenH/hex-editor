import { useState } from "react";
import { HexBuffer } from "../utils/hex";

import HexGrid from "./HexGrid";
import Scrollbar from "./Scrollbar";

interface HexEditorProps {
    data: Uint8Array;
    visibleRows: number;
}

const COLUMNS = 16;

function HexEditor({ data, visibleRows }: HexEditorProps) {
    const [scrollIndex, setScrollIndex] = useState(0);
    const [hexData] = useState(new HexBuffer(data));

    return (
        <div className="flex flex-col w-min h-full bg-[rgb(30,30,30)] ring-1 ring-neutral-700 font-mono cursor-default select-none">
            <div className="flex flex-row items-center border-b border-neutral-700">
                <div className="flex flex-row items-center h-4 ml-1 w-[52px] mr-[11px]"></div>
                <ul className="flex flex-row justify-end space-x-[10px] mr-[6px] font-medium">
                    {Array(COLUMNS)
                        .fill(null)
                        .map((_, i) => (
                            <li key={`${i}`}>{`0${i.toString(16)}`.slice(-2).toUpperCase()}</li>
                        ))}
                </ul>
            </div>
            <div className="flex flex-row h-auto">
                <HexGrid
                    data={hexData}
                    visibleRows={visibleRows}
                    columns={COLUMNS}
                    scrollIndex={scrollIndex}
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
            <div className="w-full border-t bg-[rgb(30,30,30)] border-neutral-700">
                <code>ScrollIndex: {`00000${scrollIndex}`.slice(-5)};&nbsp;</code>
            </div>
        </div>
    );
}

export default HexEditor;
