if (document.querySelector('.faq__button')) {
    document.querySelectorAll('.faq__button').forEach((el) => {
        el.addEventListener('click', (e) => {
            e.currentTarget.parentElement.classList.toggle('active')
        })
    })
}

const showButton = document.querySelector('[data-modal]')

if (showButton) {
    const modal = document.getElementById(showButton.dataset.modal)
    const closeButton = modal.querySelector('.close-button')
    
    showButton.addEventListener('click', ()=>{
        modal.classList.add('active')
    })

    if (closeButton) {
        closeButton.addEventListener('click', (e)=>{
            modal.classList.remove('active')
        })
    }

    modal.addEventListener('click', (e)=>{
        if (e.target.classList.contains('modal-wrapper')) {
            modal.classList.remove('active')
        }
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

const constructorOpenButton = document.querySelector('.constructor-open-button')
const modal3d = document.querySelector('#modal-constructor')
const showModalFormButton = document.querySelector('#show-form')

if (constructorOpenButton) {
    const closeButton = modal3d.querySelector('.close-button')
    constructorOpenButton.addEventListener('click', ()=>{
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
    closeButton.addEventListener('click', ()=>{
        modal3d.classList.remove('active')
        modal3d.querySelector('.modal').classList.remove('send-form')
    })
    showModalFormButton.addEventListener('click', ()=>{
        modal3d.querySelector('.modal').classList.add('send-form')
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
				container.querySelector('.active')?.classList.remove('active')
				e.currentTarget.classList.add('active')

                if (e.currentTarget.dataset.model === "profile") {
                    document.querySelectorAll('.color-changer .tab-item')[2].click()
                    document.querySelector('.change-model').classList.add('js-profile')
                    document.querySelector('.constructor-flex').classList.add('js-profile')
                } else {
                    document.querySelector('.change-model').classList.remove('js-profile')
                    document.querySelector('.constructor-flex').classList.remove('js-profile')
                }
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
        const nextBtn = grid.querySelector('.next')
        const prevBtn = grid.querySelector('.prev')


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


