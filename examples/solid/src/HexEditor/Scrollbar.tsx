// import { useEffect, useRef, useState } from "react";
import { createSignal, createEffect } from "solid-js";
import { EventManager } from "../utils/EventManager";

interface ScrollbarProps {
    totalRows: number;
    visibleRows: number;
    rowHeight: number;
    onScroll: (scrollIndex: number) => unknown;
}

const Scrollbar = ({ totalRows, visibleRows, rowHeight, onScroll }: ScrollbarProps) => {
    let scrollTrack: HTMLDivElement;
    let scrollThumb: HTMLDivElement;

    const [scrolling, setScrolling] = createSignal(false);

    const [thumbOffset, setThumbOffset] = createSignal(0);
    const [trackTop, setTrackTop] = createSignal(0);
    const [thumbHeight, setThumbHeight] = createSignal(20);

    const CONTENT_HEIGHT = visibleRows * rowHeight;

    createEffect(() => {
        setTrackTop(scrollTrack.getBoundingClientRect().top!);
        setThumbHeight(Math.max(20, Math.floor(CONTENT_HEIGHT * (visibleRows / totalRows))));
    }, []);

    const eventKey = Symbol();

    const handleMouseDown = (event: MouseEvent) => {
        const mouseThumbOffset = event.pageY - scrollThumb.getBoundingClientRect().top!;

        setScrolling(true);

        EventManager.subscribe("mousemove", eventKey, (event: MouseEvent) => {
            const mousePosition = Math.min(
                CONTENT_HEIGHT - thumbHeight(),
                Math.max(0, event.pageY - trackTop() - mouseThumbOffset)
            );
            const scrollFraction = mousePosition / (CONTENT_HEIGHT - thumbHeight());
            const scrollIndex = Math.max(0, Math.floor((totalRows - visibleRows) * scrollFraction));
            const thumbOffset =
                (scrollIndex / (totalRows - visibleRows)) * (CONTENT_HEIGHT - thumbHeight());

            setThumbOffset(thumbOffset);
            onScroll(scrollIndex);
        });

        EventManager.subscribe("mouseup", eventKey, () => {
            EventManager.unsubscribe("mousemove", eventKey);
            EventManager.unsubscribe("mouseup", eventKey);
            EventManager.unsubscribe("blur", eventKey);
            setScrolling(false);
        });
        EventManager.subscribe("blur", eventKey, () => {
            EventManager.unsubscribe("mousemove", eventKey);
            EventManager.unsubscribe("mouseup", eventKey);
            EventManager.unsubscribe("blur", eventKey);
            setScrolling(false);
        });
    };

    return (
        <div
            class={`w-[18px] 
			max-h-[${visibleRows * rowHeight}px]
			border-l border-neutral-700 bg-neutral-800`}
            ref={scrollTrack}
        >
            {visibleRows < totalRows ? (
                <div
                    class={`w-[calc(18px-1px)] border-none ${
                        scrolling()
                            ? "bg-[rgb(140,140,140)]"
                            : "bg-neutral-600 hover:bg-neutral-500"
                    }`}
                    ref={scrollThumb}
                    style={{ height: `${thumbHeight()}px`, "margin-top": `${thumbOffset()}px` }}
                    onMouseDown={handleMouseDown}
                >
                    &nbsp;
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default Scrollbar;
