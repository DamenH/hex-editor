<script lang="ts">
import { EventManager } from "./utils/EventManager";
import { createEventDispatcher, onMount } from "svelte";

export let totalRows: number;
export let visibleRows: number;
export let rowHeight: number;
export let scrollIndex: number;

const dispatch = createEventDispatcher();

let scrollTrack: HTMLDivElement;
let scrollThumb: HTMLDivElement;

let scrolling = false;
let thumbOffset = 0;
let thumbHeight = 20;

const CONTENT_HEIGHT = visibleRows * rowHeight;

onMount(() => {
    
    thumbHeight = Math.max(20, Math.floor(CONTENT_HEIGHT * (visibleRows / totalRows)));
});

const handleMouseDown = (event: MouseEvent) => {
    const mouseThumbOffset = event.pageY - scrollThumb.getBoundingClientRect().top!;
	const trackTop = scrollTrack.getBoundingClientRect().top!;

    scrolling = true;

    const eventKey = Symbol();

    EventManager.subscribe("mousemove", eventKey, (event: MouseEvent) => {
        const mousePosition = Math.min(
            CONTENT_HEIGHT - thumbHeight,
            Math.max(0, event.pageY - trackTop - mouseThumbOffset)
        );
        const scrollFraction = mousePosition / (CONTENT_HEIGHT - thumbHeight);
        scrollIndex = Math.max(0, Math.floor((totalRows - visibleRows) * scrollFraction));
        thumbOffset = (scrollIndex / (totalRows - visibleRows)) * (CONTENT_HEIGHT - thumbHeight);
    });

    EventManager.subscribe("mouseup", eventKey, () => {
        EventManager.unsubscribe("mousemove", eventKey);
        EventManager.unsubscribe("mouseup", eventKey);
        EventManager.unsubscribe("blur", eventKey);
        scrolling = false;
    });
    EventManager.subscribe("blur", eventKey, () => {
        EventManager.unsubscribe("mousemove", eventKey);
        EventManager.unsubscribe("mouseup", eventKey);
        EventManager.unsubscribe("blur", eventKey);
        scrolling = false;
    });
};
</script>

<div
    class="w-[18px] max-h-[{visibleRows * rowHeight}px] border-l border-neutral-700 bg-neutral-800"
    bind:this={scrollTrack}>
    {#if visibleRows < totalRows}
        <div
            class="w-[calc(18px-1px)] border-none {scrolling
                ? 'bg-[rgb(140,140,140)]'
                : 'bg-neutral-600 hover:bg-neutral-500'}
            "
            bind:this={scrollThumb}
            style="height: {thumbHeight}px; margin-top: {thumbOffset}px"
            on:mousedown={handleMouseDown}>
            &nbsp;
        </div>
    {:else}
        ""
    {/if}
</div>
