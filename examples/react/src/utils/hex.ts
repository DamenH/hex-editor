export function toHex(value: number, padding = 2) {
	return value.toString(16).toUpperCase().padStart(padding, '0');
}

const LUT_HEX_4b = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
const LUT_HEX_8b = new Array(0x100)
	.fill('')
	.map((_, i) => `${LUT_HEX_4b[(i >>> 4) & 0xf]}${LUT_HEX_4b[i & 0xf]}`);

function toHexArray(buffer: Uint8Array) {
	let out: string[] = [];
	for (let i = 0; i < buffer.length; i++) {
		out.push(LUT_HEX_8b[buffer[i]]);
	}
	return out;
}

export class HexBuffer {
	public hex: Array<string>;

	constructor(private buffer: Uint8Array) {
		this.hex = toHexArray(buffer);
	}

	public update(index: number, value: Uint8Array | number) {
		if (typeof value === 'number') {
			this.hex[index] = toHex(value);
			this.buffer[index] = value;
			return;
		}
		for (let i = 0; i < value.length; i++) {
			this.hex[index + i] = toHex(value[i]);
			this.buffer[index + i] = value[i];
		}
	}
}
