import { useEffect, useRef, useState } from "react";
import { EventManager } from "../EventManager";

interface ScrollbarProps {
    totalRows: number;
    rowHeight: number;
    scroll: (scrollIndex: number) => any;
}

const Scrollbar = ({ totalRows, rowHeight, scroll }: ScrollbarProps) => {
    const scrollTrack = useRef<HTMLDivElement>(null);
    const scrollThumb = useRef<HTMLDivElement>(null);

    const [scrollIndex, setScrollIndex] = useState(0);
    const [scrolling, setScrolling] = useState(false);
    const [thumbOffset, setThumbOffset] = useState(0);

    const [trackTop, setTrackTop] = useState(0);
    const [trackHeight, setTrackHeight] = useState(0);
    const [thumbHeight, setThumbHeight] = useState(20);

    useEffect(() => {
        const trackHeight = scrollTrack.current?.getBoundingClientRect().height!;
        setTrackTop(scrollTrack.current?.getBoundingClientRect().top!);
        setTrackHeight(trackHeight);
        setThumbHeight(
            Math.max(20, Math.floor((trackHeight / (totalRows * rowHeight)) * trackHeight))
        );
    });

    const eventKey = Symbol();

    const handleMouseDown = (event: React.MouseEvent<HTMLInputElement>) => {
        const mouseThumbOffset = event.pageY - scrollThumb.current?.getBoundingClientRect().top!;

        setScrolling(true);

        EventManager.subscribe("mousemove", eventKey, (event: MouseEvent) => {
            const mousePosition = Math.min(
                trackHeight - thumbHeight,
                Math.max(0, event.pageY - trackTop - mouseThumbOffset)
            );
            const scrollFraction = mousePosition / (trackHeight - thumbHeight);
            const visibleRows = Math.floor(trackHeight / rowHeight);
            const scrollIndex = Math.max(0, Math.floor((totalRows - visibleRows) * scrollFraction));
            const quantizedScrollFraction = scrollIndex / totalRows;
            const thumbOffset = quantizedScrollFraction * trackHeight;
            setThumbOffset(thumbOffset);
            scroll(scrollIndex);
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
            className={`h-auto w-[18px] border-l border-neutral-700 bg-neutral-800`}
            ref={scrollTrack}
        >
            <div
                className={`w-[calc(18px-1px)] border-none ${
                    scrolling ? "bg-[rgb(140,140,140)]" : "bg-neutral-600 hover:bg-neutral-500"
                }`.trim()}
                ref={scrollThumb}
                style={{ height: thumbHeight, marginTop: thumbOffset }}
                onMouseDown={handleMouseDown}
            >
                &nbsp;
            </div>
        </div>
    );
};

export default Scrollbar;
