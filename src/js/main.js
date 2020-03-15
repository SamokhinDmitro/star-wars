/*
Owl-carousel
 */

$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        nav:true,
        responsiveClass:true,
        navClass:['slider__nav slider__nav--prev', 'slider__nav slider__nav--next'],
        responsive:{
            0:{
                items:1
            },
            700:{
                items:2
            },
            900:{
                items: 3
            },
            1200:{
                items:4
            }
        }
    })
});

