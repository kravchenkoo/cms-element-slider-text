import DomAccess from "src/helper/dom-access.helper"
const scrollDownBtn = DomAccess.querySelector(document, '.image-slider-scroll-down');
const scrollDownValue = Number(scrollDownBtn.dataset.scrollDown)
scrollDownBtn.addEventListener('click', function () {
    window.scrollBy({
        top: scrollDownValue,
        left: 0,
        behavior : "smooth"
    })
});
