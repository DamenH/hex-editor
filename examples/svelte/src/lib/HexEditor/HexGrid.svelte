<script lang="ts">
import { toHex, type HexBuffer } from "./utils/hex";

export let data: HexBuffer;
export let visibleRows: number;
export let columns: 8 | 16 | 32 | 64 | 128;
export let scrollIndex: number;
</script>

<div class="flex flex-row w-full h-full bg-neutral-800">
    <ul class="w-fit pl-1 pr-1 border-r border-neutral-700 bg-[rgb(30,30,30)] text-blue-500">
        {#each Array(visibleRows)
            .fill("")
            .map((_, i) => `000000${toHex(scrollIndex * columns + i * columns, 6)}`
                    .slice(-6)
                    .toUpperCase()) as v}
            <li class="h-[21px]">
                {v}
            </li>
        {/each}
    </ul>
    <div>
        {#each Array(visibleRows).fill("") as _, i}
            <ul class="flex flex-row space-x-[10px] mx-[6px]">
                {#each Array(columns).fill("") as _, j}
                    <li class="h-[21px]">
                        {`00${data.hex[scrollIndex * columns + i * columns + j]}`
                            .slice(-2)
                            .toUpperCase()}
                    </li>
                {/each}
            </ul>
        {/each}
    </div>
</div>
