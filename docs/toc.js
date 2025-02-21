// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><li class="part-title">iShape</li><li class="chapter-item expanded "><a href="overlay/overlay.html"><strong aria-hidden="true">1.</strong> iOverlay</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="overlay/stars_demo.html"><strong aria-hidden="true">1.1.</strong> Demo</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="overlay/stars_demo.html"><strong aria-hidden="true">1.1.1.</strong> Stars Rotation</a></li><li class="chapter-item expanded "><a href="overlay/shapes_editor.html"><strong aria-hidden="true">1.1.2.</strong> Shapes Editor</a></li><li class="chapter-item expanded "><a href="overlay/stroke.html"><strong aria-hidden="true">1.1.3.</strong> Stroke Offset</a></li><li class="chapter-item expanded "><a href="overlay/overlay_editor.html"><strong aria-hidden="true">1.1.4.</strong> Overlay Editor</a></li></ol></li><li class="chapter-item expanded "><a href="overlay/performance/performance.html"><strong aria-hidden="true">1.2.</strong> Performance Comparison</a></li><li class="chapter-item expanded "><a href="overlay/stars_demo.html"><strong aria-hidden="true">1.3.</strong> Documentation</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="overlay/filling_rules/filling_rules.html"><strong aria-hidden="true">1.3.1.</strong> Filling Rules</a></li><li class="chapter-item expanded "><a href="overlay/overlay_rules/overlay_rules.html"><strong aria-hidden="true">1.3.2.</strong> Overlay Rules</a></li><li class="chapter-item expanded "><a href="overlay/contours/contours.html"><strong aria-hidden="true">1.3.3.</strong> Contours</a></li><li class="chapter-item expanded "><a href="overlay/overlay_graph/overlay_graph.html"><strong aria-hidden="true">1.3.4.</strong> Overlay Graph</a></li><li class="chapter-item expanded "><a href="overlay/extract/extract_shapes.html"><strong aria-hidden="true">1.3.5.</strong> Extract Shapes</a></li></ol></li></ol></li><li class="chapter-item expanded "><a href="triangle/triangle.html"><strong aria-hidden="true">2.</strong> iTriangle</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="triangle/delaunay.html"><strong aria-hidden="true">2.1.</strong> Delaunay</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
