import { EventManager } from "./utils/EventManager";
import { HexBuffer, toHex } from "./utils/hex";

type Accessor<T> = (updater: (value: T) => void) => void;
type Setter<T> = (value: T) => void;

function createSignal<T>(initial: T): [Accessor<T>, Setter<T>] {
    let state = initial;
    const subscribers = Array<(value: T) => void>();

    const get = (updater: (value: T) => void) => {
        subscribers.push(updater);
    };

    const set = (value: T) => {
        state = value;
        subscribers.forEach((updater) => {
            updater(state);
        });
    };
    return [get, set];
}

export async function setupHexEditor(
    hexEditor: HTMLDivElement,
    data: Uint8Array,
    visibleRows: number
) {
    const [scrollIndex, setScrollIndex] = createSignal(0);

    setScrollIndex(0);

    const COLUMNS = 16;
    const rowHeight = 21;

    hexEditor.setAttribute(
        "class",
        "flex flex-col w-min h-full bg-[rgb(30,30,30)] ring-1 ring-neutral-700 font-mono cursor-default select-none"
    );

    const columnIndexParent = document.createElement("div");
    columnIndexParent.setAttribute(
        "class",
        "flex flex-row items-center border-b border-neutral-700"
    );

    const columnIndexSpacer = document.createElement("div");
    columnIndexSpacer.setAttribute(
        "class",
        "flex flex-row items-center h-4 ml-1 w-[52px] mr-[11px]"
    );

    const columnIndices = document.createElement("ul");
    columnIndices.setAttribute(
        "class",
        "flex flex-row justify-end space-x-[10px] mr-[6px] font-medium"
    );

    for (let i = 0; i < COLUMNS; i++) {
        const columnIndex = document.createElement("li");
        columnIndex.textContent = `0${i.toString(16)}`.slice(-2).toUpperCase();
        columnIndices.appendChild(columnIndex);
    }

    columnIndexParent.appendChild(columnIndexSpacer);
    columnIndexParent.appendChild(columnIndices);

    const mainParent = document.createElement("div");
    mainParent.setAttribute("class", "flex flex-row h-auto w-full");

    const dataGrid = document.createElement("div");
    setupHexGrid(dataGrid, new HexBuffer(data), visibleRows, COLUMNS, scrollIndex);

    const scrollbar = document.createElement("div");
    setupScrollBar(scrollbar, data.length / COLUMNS, visibleRows, rowHeight, (i) => {
        setScrollIndex(i);
    });

    mainParent.appendChild(dataGrid);
    mainParent.appendChild(scrollbar);

    const footerParent = document.createElement("div");
    footerParent.setAttribute("class", "w-full border-t bg-[rgb(30,30,30)] border-neutral-700");

    const footerData = document.createElement("code");
    scrollIndex((scrollIndex) => {
        footerData.textContent = `ScrollIndex: ${`00000${scrollIndex}`.slice(-5)};`;
    });
    footerParent.appendChild(footerData);

    hexEditor.appendChild(columnIndexParent);
    hexEditor.appendChild(mainParent);
    hexEditor.appendChild(footerParent);

    setScrollIndex(0);
}

function setupHexGrid(
    hexGrid: HTMLDivElement,
    data: HexBuffer,
    visibleRows: number,
    columns: number,
    scrollIndex: Accessor<number>
) {
    hexGrid.setAttribute("class", "flex flex-row w-max h-full bg-neutral-800");

    const rowIndices = document.createElement("ul");
    rowIndices.setAttribute(
        "class",
        "w-fit pl-1 pr-1 border-r border-neutral-700 bg-[rgb(30,30,30)] text-blue-500"
    );

    for (let i = 0; i < visibleRows; i++) {
        const rowIndex = document.createElement("li");
        rowIndex.setAttribute("class", "h-[21px]");
        rowIndex.textContent = `000000${toHex(columns + i * columns, 6)}`.slice(-6).toUpperCase();

        rowIndices.appendChild(rowIndex);
    }

    const dataParent = document.createElement("div");

    const dataBytes = Array<HTMLLIElement>();

    for (let i = 0; i < visibleRows; i++) {
        const dataRow = document.createElement("ul");
        dataRow.setAttribute("class", "flex flex-row space-x-[10px] mx-[6px]");
        for (let j = 0; j < columns; j++) {
            const dataByte = document.createElement("li");
            dataByte.setAttribute("class", "h-[21px]");
            dataByte.textContent = "XX";
            dataRow.appendChild(dataByte);
            dataBytes.push(dataByte);
        }
        dataParent.appendChild(dataRow);
    }

    scrollIndex((scrollIndex) => {
        dataBytes.forEach((dataByte, index) => {
            let i = index / columns;
            let j = index % columns;

            dataByte.textContent = `00${data.hex[scrollIndex * columns + i * columns + j]}`
                .slice(-2)
                .toUpperCase();
        });
        rowIndices.querySelectorAll("li").forEach((rowIndex, i) => {
            rowIndex.textContent = `000000${toHex(scrollIndex * columns + i * columns, 6)}`
                .slice(-6)
                .toUpperCase();
        });
    });

    hexGrid.appendChild(rowIndices);
    hexGrid.appendChild(dataParent);
}

function setupScrollBar(
    scrollbar: HTMLDivElement,
    totalRows: number,
    visibleRows: number,
    rowHeight: number,
    onScroll: (scrollIndex: number) => unknown
) {
    scrollbar.setAttribute(
        "class",
        `w-[18px] max-h-[${visibleRows * rowHeight}px] border-l border-neutral-700 bg-neutral-800`
    );

    if (visibleRows < totalRows) {
        const scrollThumb = document.createElement("div");
        scrollThumb.setAttribute(
            "class",
            "w-[calc(18px-1px)] border-none bg-neutral-600 hover:bg-neutral-500"
        );

        const [scrolling, setScrolling] = createSignal(false);
        const [thumbOffset, setThumbOffset] = createSignal(0);

        const CONTENT_HEIGHT = visibleRows * rowHeight;
        let thumbHeight = Math.max(20, Math.floor(CONTENT_HEIGHT * (visibleRows / totalRows)));

        scrollThumb.setAttribute("style", `height: ${thumbHeight}px; margin-top: ${0}px`);

        thumbOffset((thumbOffset) => {
            scrollThumb.setAttribute(
                "style",
                `height: ${thumbHeight}px; margin-top: ${thumbOffset}px`
            );
        });

        scrolling((scrolling) => {
            if (scrolling) {
                scrollThumb.setAttribute(
                    "class",
                    "w-[calc(18px-1px)] border-none bg-[rgb(140,140,140)]"
                );
            } else {
                scrollThumb.setAttribute(
                    "class",
                    "w-[calc(18px-1px)] border-none bg-neutral-600 hover:bg-neutral-500"
                );
            }
        });

        const eventKey = Symbol();

        scrollThumb.addEventListener("mousedown", (event: MouseEvent) => {
            const mouseThumbOffset = event.pageY - scrollThumb.getBoundingClientRect().top!;
            const trackTop = scrollbar.getBoundingClientRect().top!;

            setScrolling(true);

            let timeout: number;

            EventManager.subscribe("mousemove", eventKey, (event: MouseEvent) => {
                if (timeout) {
                    window.cancelAnimationFrame(timeout);
                }

                timeout = window.requestAnimationFrame(function () {
                    const mousePosition = Math.min(
                        CONTENT_HEIGHT - thumbHeight,
                        Math.max(0, event.pageY - trackTop - mouseThumbOffset)
                    );
                    const scrollFraction = mousePosition / (CONTENT_HEIGHT - thumbHeight);
                    const scrollIndex = Math.max(
                        0,
                        Math.floor((totalRows - visibleRows) * scrollFraction)
                    );
                    const thumbOffset =
                        (scrollIndex / (totalRows - visibleRows)) * (CONTENT_HEIGHT - thumbHeight);

                    setThumbOffset(thumbOffset);
                    onScroll(scrollIndex);
                });
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
        });

        scrollbar.appendChild(scrollThumb);
    }
}
