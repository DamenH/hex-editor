import { HexBuffer, toHex } from "../utils/hex";

interface HexGridProps {
    data: HexBuffer;
    visibleRows: number;
    columns: 8 | 16 | 32 | 64 | 128;
    scrollIndex: number;
}

function HexGrid({ data, visibleRows, columns, scrollIndex }: HexGridProps) {
    return (
        <div className="flex flex-row w-full h-full bg-neutral-800">
            <ul className="w-fit pl-1 pr-1 border-r border-neutral-700 bg-[rgb(30,30,30)] text-blue-500">
                {Array(visibleRows)
                    .fill("")
                    .map((_, i) =>
                        `000000${toHex(scrollIndex * columns + i * columns, 6)}`
                            .slice(-6)
                            .toUpperCase()
                    )
                    .map((v, i) => (
                        <li className="h-[21px]" key={`${i}`}>
                            {v}
                        </li>
                    ))}
            </ul>
            <div>
                {Array(visibleRows)
                    .fill(0)
                    .map((_, i) => (
                        <ul
                            className="flex flex-row space-x-[10px] mx-[6px]"
                            key={`${i * columns}`}
                        >
                            {Array(columns)
                                .fill(0)
                                .map((_, j) => (
                                    <li className="h-[21px]" key={`${i * columns + j}`}>
                                        {`00${data.hex[scrollIndex * columns + i * columns + j]}`
                                            .slice(-2)
                                            .toUpperCase()}
                                    </li>
                                ))}
                        </ul>
                    ))}
            </div>
        </div>
    );
}

export default HexGrid;
