window.addEventListener('load', () => {

    const humb = document.querySelector('#open');
    const menu = document.querySelector('.nav__list');
    const body = document.body

    humb.onclick = function () {
        humb.classList.toggle('--active')
        menu.classList.toggle('--active')
        body.classList.toggle('--disable-scroll')
    }
})