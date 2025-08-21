$(document).ready(function(){
   $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        var targetElement = $($anchor.attr('href'));
        
        // Check if target element exists before accessing offset
        if (targetElement.length) {
            $('html, body').stop().animate({
                scrollTop: targetElement.offset().top
            }, 1500, 'easeInOutExpo');
        }
        event.preventDefault();
    });
});

$('body').scrollspy({
    target: '.navbar-fixed-top'
})

$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});