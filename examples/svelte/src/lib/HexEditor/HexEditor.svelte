<script lang="ts">
import { HexBuffer } from "./utils/hex";

import HexGrid from "./HexGrid.svelte";
import Scrollbar from "./Scrollbar.svelte";

export let data: Uint8Array;
export let visibleRows: number;

const COLUMNS = 16;

let hexData = new HexBuffer(data);
let scrollIndex = 0;
</script>

<div
    class="flex flex-col w-min h-full bg-[rgb(30,30,30)] ring-1 ring-neutral-700 font-mono cursor-default select-none">
    <div class="flex flex-row items-center border-b border-neutral-700">
        <div class="flex flex-row items-center h-4 ml-1 w-[52px] mr-[11px]" />
        <ul class="flex flex-row justify-end space-x-[10px] mr-[6px] font-medium">
            {#each Array(COLUMNS).fill(null) as _, i}
                <li>{`0${i.toString(16)}`.slice(-2).toUpperCase()}</li>
            {/each}
        </ul>
    </div>
    <div class="flex flex-row h-auto">
        <HexGrid data={hexData} {visibleRows} columns={COLUMNS} {scrollIndex} />
        <Scrollbar
            totalRows={data.length / COLUMNS}
            {visibleRows}
            rowHeight={21}
            bind:scrollIndex />
    </div>
    <div class="w-full border-t bg-[rgb(30,30,30)] border-neutral-700">
        <code>ScrollIndex: {`00000${scrollIndex}`.slice(-5)};&nbsp;</code>
    </div>
</div>
