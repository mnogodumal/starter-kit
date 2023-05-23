import Inputmask from "inputmask";

window.addEventListener('load', () => {
    let input = document.getElementById('input-phone');

    let im = new Inputmask("999 999-99-99")
    im.mask(input)   
})