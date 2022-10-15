<script lang="ts">
import HexEditor from "./lib/HexEditor/HexEditor.svelte";
</script>

<main class="flex flex-col h-screen items-center justify-center bg-[rgb(50,50,50)] text-white">
    <div class="min-h-fit overflow-hidden">
        <HexEditor
            data={new Uint8Array(524_288).fill(0x00).map(() => Math.floor(Math.random() * 256))}
            visibleRows={32} />
    </div>
</main>

<style>
</style>
