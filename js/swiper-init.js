var mainCardsSwiper = new Swiper('#mainCardsSwiper', {
    slidesPerView: "auto",
    spaceBetween: 45,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
})

var mainLoopSwiper = new Swiper('#mainLoopSwiper', {
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 40,
    centeredSlides: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      877: {        
        centeredSlides: true,
      },
    },
})