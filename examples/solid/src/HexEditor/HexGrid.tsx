import { HexBuffer, toHex } from "../utils/hex";

interface HexGridProps {
    data: HexBuffer;
    visibleRows: number;
    columns: 8 | 16 | 32 | 64 | 128;
    scrollIndex: number;
}

function HexGrid(props: HexGridProps) {
    return (
        <div class="flex flex-row w-full h-full bg-neutral-800">
            <ul class="w-fit pl-1 pr-1 border-r border-neutral-700 bg-[rgb(30,30,30)] text-blue-500">
                {Array(props.visibleRows)
                    .fill("")
                    .map((_, i) =>
                        `000000${toHex(props.scrollIndex * props.columns + i * props.columns, 6)}`
                            .slice(-6)
                            .toUpperCase()
                    )
                    .map((v, i) => (
                        <li class="h-[21px]">{v}</li>
                    ))}
            </ul>
            <div>
                {Array(props.visibleRows)
                    .fill(0)
                    .map((_, i) => (
                        <ul class="flex flex-row space-x-[10px] mx-[6px] h-[21px]">
                            {Array(props.columns)
                                .fill(0)
                                .map((_, j) => (
                                    <li>
                                        {`00${
                                            props.data.hex[
                                                props.scrollIndex * props.columns +
                                                    i * props.columns +
                                                    j
                                            ]
                                        }`
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
