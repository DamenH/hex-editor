interface HexGridProps {
    data: Uint8Array;
    columns: 8 | 16 | 32 | 64 | 128;
    scrollIndex: number;
    byteStates: Uint8Array;
}

function HexGrid({ data, columns, scrollIndex, byteStates }: HexGridProps) {
    return (
        <div className="flex flex-row w-full h-full bg-neutral-800">
            <ul className="w-fit pl-1 pr-1 border-r border-neutral-700 bg-[rgb(30,30,30)]">
                {Array(16)
                    .fill(null)
                    .map((_, i) => (
                        <li className="h-[21px] text-blue-500" key={`${i}`}>
                            {`000000${i.toString(16)}`.slice(-6).toLocaleUpperCase()}
                        </li>
                    ))}
            </ul>
            <div>
                {Array(16)
                    .fill(0)
                    .map((_, i) => (
                        <ul
                            className="flex flex-row space-x-[10px] mx-[6px]"
                            key={`${i * columns}`}
                        >
                            {Array(16)
                                .fill(0)
                                .map((_, j) => (
                                    <li className="h-[21px]" key={`${i * columns + j}`}>
                                        {`00${(i * columns + j).toString(16)}`
                                            .slice(-2)
                                            .toLocaleUpperCase()}
                                    </li>
                                ))}
                        </ul>
                    ))}
            </div>
        </div>
    );
}

export default HexGrid;
