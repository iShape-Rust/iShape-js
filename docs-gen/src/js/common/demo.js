export function bindRangeOutput(input, output, formatter = String) {
    const update = () => {
        output.value = formatter(Number(input.value));
    };
    input.addEventListener("input", update);
    update();
}
export function formatTestTitle(index, total, name) {
    return `${index + 1} / ${total} — ${name}`;
}
export function formatHundredths(value) {
    return Number((0.01 * value).toFixed(2)).toString();
}
//# sourceMappingURL=demo.js.map