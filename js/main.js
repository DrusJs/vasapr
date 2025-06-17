if (document.querySelector('.faq__button')) {
    document.querySelectorAll('.faq__button').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.currentTarget.parentElement.classList.toggle('active')
        })
    })
}


let pageUpButton = document.querySelector('.page-up__button')
if (pageUpButton) {
    pageUpButton.addEventListener('click', () => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    })
}
window.addEventListener('scroll', () => {
    if (+window.scrollY >= 600) {
        pageUpButton.classList.remove('hide')
    } else {
        pageUpButton.classList.add('hide')
    }
})

if (document.querySelector('.burger-button')) {
    document.querySelector('.burger-button').addEventListener('click', (e) => {
        document.querySelector('.nav').classList.toggle('active')
        e.currentTarget.classList.toggle('active')
        document.body.classList.toggle('scroll-hidden')
    })
}

if (document.querySelector('.header__link')) {
    document.querySelectorAll('.header__link').forEach((link) => {
        link.addEventListener('click', () => {
            document.querySelector('.burger-button').classList.remove('active')
            document.querySelector('.nav').classList.remove('active')
            document.body.classList.remove('scroll-hidden')
        })
    })
}

const previewOpen = document.querySelector('.pref__preview')
const modal3d = document.querySelector('#modal-constructor')
if (previewOpen) {
    const closeButton = modal3d.querySelector('.close-button')
    previewOpen.addEventListener('click', (e)=>{
        modal3d.classList.add('active')
    })
    modal3d.addEventListener('touchstart', (e)=>{
        if (e.target.classList.contains('modal-wrapper')) {
            modal3d.classList.remove('active')
        }
    })
    modal3d.addEventListener('mousedown', (e)=>{
        if (e.target.classList.contains('modal-wrapper')) {
            modal3d.classList.remove('active')
        }
    })
    closeButton.addEventListener('click', (e)=>{
        modal3d.classList.remove('active')
    })
}



