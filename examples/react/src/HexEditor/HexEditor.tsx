import { useState } from "react";
import HexGrid from "./HexGrid";
import Scrollbar from "./Scrollbar";

interface HexEditorProps {
    data: Uint8Array;
}

const COLUMNS = 16;

function HexEditor({ data }: HexEditorProps) {
    const [scrollIndex, setScrollIndex] = useState(0);
    return (
        <div className="flex flex-col w-min h-fit bg-[rgb(30,30,30)] ring-1 ring-neutral-700 font-mono cursor-default select-none">
            <div className="flex flex-row items-center border-b border-neutral-700">
                <div className="flex flex-row items-center bg-neutral-500 h-4 ml-1 mr-[11px]">
                    <span className="w-min">&nbsp;GOTO&nbsp;</span>
                </div>
                <ul className="flex flex-row justify-end space-x-[10px] mr-[6px] font-medium">
                    {Array(COLUMNS)
                        .fill(null)
                        .map((_, i) => (
                            <li key={`${i}`}>
                                {`0${i.toString(16)}`.slice(-2).toLocaleUpperCase()}
                            </li>
                        ))}
                </ul>
                <div className="flex flex-row items-center justify-center hover:bg-neutral-500 w-4 h-4 mr-px text-white">
                    <svg
                        className="fill-neutral-300  cursor-pointer"
                        viewBox="0 0 29.96 122.88"
                        width={18}
                        height={14}
                    >
                        <path
                            d="M15,0A15,15,0,1,1,0,15,15,15,0,0,1,15,0Zm0,92.93a15,15,0,1,
							1-15,15,15,15,0,0,1,15-15Zm0-46.47a15,15,0,1,1-15,15,15,15,0,0,1,15-15Z"
                        />
                    </svg>
                </div>
            </div>
            <div className="flex flex-row h-auto">
                <HexGrid
                    {...{ data, columns: COLUMNS, scrollIndex, byteStates: new Uint8Array() }}
                ></HexGrid>
                <Scrollbar
                    {...{
                        totalRows: data.length / COLUMNS,
                        rowHeight: 21,
                        scroll: (index) => {
                            setScrollIndex(index);
                        },
                    }}
                ></Scrollbar>
            </div>
            <div className="w-full  border-t bg-[rgb(30,30,30)] border-neutral-700">
                {scrollIndex}
            </div>
        </div>
    );
}

export default HexEditor;
