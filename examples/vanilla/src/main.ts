import "./style.css";
import { setupHexEditor } from "./hexEditor";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<main class="flex flex-col h-screen items-center justify-center bg-[rgb(50,50,50)] text-white">
	<div class="min-h-fit overflow-hidden">
		<div id="hex-editor"></div>
	</div>
</main>
`;

setupHexEditor(
    document.querySelector<HTMLDivElement>("#hex-editor")!,
    new Uint8Array(524_288).fill(0x00).map(() => Math.floor(Math.random() * 256)),
    32
);
