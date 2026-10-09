(() => {
    const regions = document.querySelectorAll(
        '.geometry-diagram-frame--scroll, .benchmark-section .table-wrapper'
    );

    for (const region of regions) {
        region.tabIndex = 0;
        region.setAttribute('role', 'region');
        if (!region.hasAttribute('aria-label')) {
            region.setAttribute('aria-label',
                region.querySelector('svg')?.getAttribute('aria-label') || 'Benchmark results');
        }

        // Keep native scrolling while preventing mdBook's chapter shortcuts.
        region.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.stopPropagation();
            }
        });
    }
})();
