export type RangeFormatter = (value: number) => string;

export function bindRangeOutput(
    input: HTMLInputElement,
    output: HTMLOutputElement,
    formatter: RangeFormatter = String,
): void {
    const update = (): void => {
        output.value = formatter(Number(input.value));
    };

    input.addEventListener("input", update);
    update();
}

export function formatTestTitle(index: number, total: number, name: string): string {
    return `${index + 1} / ${total} — ${name}`;
}

export function formatHundredths(value: number): string {
    return Number((0.01 * value).toFixed(2)).toString();
}
