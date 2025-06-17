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

const uiChange = document.querySelectorAll('.color-changer')
const inputColors = document.querySelectorAll('.color-changer input')
const gridColors = document.querySelectorAll('.color-changer .grid-colors')
const tabSwitcher = document.querySelectorAll('.tab-item')
const changeModel = document.querySelectorAll('.change-model button')


if (changeModel.length > 0) {
    changeModel.forEach(el=>{
        el.addEventListener('click', (e)=>{
            const container = e.currentTarget.parentElement

            if (!e.currentTarget.classList.contains('active')) {
                const active = container.querySelector('.active')
                const ind = Array.from(changeModel).indexOf(e.currentTarget)

                if (active) { active.classList.remove('active') }
                e.currentTarget.classList.add('active')

                uiChange.forEach(el => { el.style.display = 'none' })
                uiChange[ind].style.display = 'flex'
            }
        })
    })
}

if (tabSwitcher.length > 0) {
    tabSwitcher.forEach(el=>{
        el.addEventListener('click', (e)=>{
            const container = e.currentTarget.nextElementSibling
            const parent = e.currentTarget.closest('.color-changer')

            if (!container.classList.contains('active')) {
                const active = parent.querySelector('.grid-colors.active')

                if (active) { active.classList.remove('active') }
                container.classList.add('active')
                parent.querySelector('.tab-item.active').classList.remove('active')
                e.currentTarget.classList.add('active')
            }
        })
    })
}

if (gridColors.length > 0) {
    gridColors.forEach((grid) => {
        const switcher = grid.querySelectorAll('.color')
        const nextBtn = grid.querySelector('.next')
        const prevBtn = grid.querySelector('.prev')


        switcher.forEach(el=>{
            el.addEventListener('click', (e)=>{
                if (!e.currentTarget.classList.contains('active')) {
                    const active = grid.querySelector('.color.active')

                    if (active) { active.classList.remove('active') }
                    e.currentTarget.classList.add('active')
                }
            })
        })

        nextBtn.addEventListener('click', (e=>{
            const actTab = grid.querySelector('.colors-page.active')

            prevBtn.classList.remove('disabled')

            if (actTab.nextElementSibling.classList.contains('colors-page')) {
                actTab.classList.remove('active')
                actTab.nextElementSibling.classList.add('active')
            }

            if (!actTab.nextElementSibling.nextElementSibling) {
                e.currentTarget.classList.add('disabled')
            }
        }))

        prevBtn.addEventListener('click', (e=>{
            const actTab = grid.querySelector('.colors-page.active')

            nextBtn.classList.remove('disabled')

            if (actTab.previousElementSibling.classList.contains('colors-page')) {
                actTab.classList.remove('active')
                actTab.previousElementSibling.classList.add('active')
            }

            if (!actTab.previousElementSibling.previousElementSibling.classList.contains('colors-page')) {
                e.currentTarget.classList.add('disabled')
            }
        }))

    })
}


