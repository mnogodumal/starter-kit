window.addEventListener('load', () => {
    


    document.querySelectorAll('[href^="#"][data-scroll=true]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()
    
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            })
        })
    })
})

