$(document).ready(function () {
    // initializing image viewer

    // this is what counts as an image
    var img = '.image-gallery img, .masonry-gallery img, #markdownit-comms img';
    // this is the container to check for updates in
    var container = 'main';

    const imageviewer = $('<div></div>').addClass('ivr'),
        imageviewerbg = $('<div></div>').addClass('ivr-bg'),
        imageviewer_arrows = $('<div></div>').addClass('ivr-arrows'),
        imageviewerinner = $('<div></div>').addClass('ivr-inner'),
        imageviewer_img = $('<div></div>').addClass('ivr-img'),
        imageviewer_descwrap = $('<div></div>').addClass('ivr-descwrap'),
        imageviewer_desc = $('<div></div>').addClass('ivr-desc'),
        imageviewer_carousel_wrap = $('<div></div>').addClass('ivr-carousel-wrap'),
        imageviewer_carousel = $('<div></div>').addClass('ivr-carousel');

    //handle closing
    var closeviewer = $('<div></div>').addClass('close-viewer').html('<svg viewBox="0 0 180 180"><path d="M5 5 L175 175 M175 5 L5 175"></path></svg>');
    closeviewer.click(function () { imageviewer.fadeOut(100); viewerIsOpen = false });
    imageviewerbg.click(function () { imageviewer.fadeOut(100); viewerIsOpen = false });

    //arrows
    imageviewer_arrows.append(
        $('<div></div>').addClass('ivr-arrows-prev'),
        $('<div></div>').addClass('ivr-arrows-next')
    );

    imageviewer_carousel_wrap.append(
        $('<div></div>').addClass('crs-prev'),
        $('<div></div>').addClass('crs-next')
    )

    imageviewer_desc.append(
        $('<div></div>').addClass('ivr-title'),
        $('<div></div>').addClass('ivr-caption'),
        imageviewer_carousel_wrap.append(imageviewer_carousel)
    );


    imageviewerinner.append(imageviewer_img);
    imageviewer_descwrap.append(imageviewer_desc);

    imageviewer.append(imageviewerbg, imageviewer_arrows, imageviewerinner, imageviewer_descwrap, closeviewer);
    imageviewer.hide();
    $('body').append(imageviewer);

    // page is live

    img += ':visible'

    const btnPrev = $('.ivr-arrows-prev'),
        btnNext = $('.ivr-arrows-next'),
        crsPrev = $('.crs-prev'),
        crsNext = $('.crs-next'),
        crsItemW = 60;

    var currentimg = 0;
    var viewerIsOpen = false;

    function imageViewer() {
        var images = $(img);

        images.off();
        btnNext.off();
        btnPrev.off();

        images.click(function (e) {
            e.preventDefault();
            showImage(this)
        });
        btnNext.click(function () {
            showImage(currentimg + 1);
        });
        btnPrev.click(function () {
            showImage(currentimg - 1);
        });

        imageviewer_carousel.empty()
        images.each(function () {
            imageviewer_carousel.append($('<img>').attr('src', $(this).find('img').attr('src')).addClass('ivr-crs-item'))
        });

        $('.ivr-crs-item').click(function () {
            showImage($(this).index())
        });


        function showImage(id) {
            viewerIsOpen = true;

            btnPrev.show();
            btnNext.show();

            crsPrev.show();
            crsNext.show();

            if (id > -1) {
                var idx = id;
            } else {
                var idx = images.index($(id));
            }

            // hide next/prev buttons if first or last
            if (idx >= images.length - 1) { btnNext.hide() }
            if (idx == 0) { btnPrev.hide() }

            // decide where to get the image url
            if ($(images[idx]).attr('src')) {
                var imgsrc = $(images[idx]).attr('src');
            } else {
                var imgsrc = $(images[idx]).find('img').attr('src')
            }

            /*
            const fileurl = $(images[idx]).attr('href')
            const filename = fileurl.replace(/.*File:/g, '').replaceAll('_', ' ')
            $('.ivr-title').html(
                $('<a>')
                    .attr('href', fileurl)
                    .attr('target', '_blank')
                    .text(filename)
                )
            */

            // caption
            const filecaption = $(images[idx]).find('img').attr('alt')
            $('.ivr-caption').html(filecaption)

            //carousel manip

            $('.crs-active').removeClass('crs-active')
            const this_in_carousel = imageviewer_carousel.find('.ivr-crs-item').eq(idx);
            this_in_carousel.addClass('crs-active');


            imageviewer_img.html($('<img>').attr('src', imgsrc))
            imageviewer.fadeIn(300);
            currentimg = idx;

            const crs_width = $('.ivr-carousel-wrap').width(),
                crs_innerwidth = $('.ivr-carousel').width();

            /*
            if (crs_innerwidth > crs_width) {
                pos_left = this_in_carousel.position().left,
                move_carousel = (crs_width/2) - pos_left - crsItemW/2;
    
                $('.ivr-carousel').css('transform', 'translateX(' + move_carousel + 'px)');
            } else {
                crsPrev.hide()
                crsNext.hide()
                $('.ivr-carousel').css('transform','')
            }

            if (move_carousel > 70) {
                crsPrev.hide()
            }

            if (move_carousel < -crs_innerwidth + crs_width) {
                crsNext.hide()
            }
            */
        }
/*
        $(window).off(arrowKeyCtrls);
        $(window).keyup(arrowKeyCtrls);
*/
        function arrowKeyCtrls(event) {
            if (viewerIsOpen) {
                switch (event.key) {
                    case 'ArrowLeft':
                        showImage(currentimg - 1)
                        break;

                    case 'ArrowRight':
                        showImage(currentimg + 1)
                }
            }
        }
    }

    //carousel buttons

    crsPrev.click(function () {
        carouselMove('prev')
    })
    crsNext.click(function () {
        carouselMove('next')
    })


    function carouselMove(direction) {
        const
            crs_offset = parseInt($('.ivr-carousel').attr('style').replace(/.*translateX\((.*)px\).*/, '$1')),
            crs_width = $('.ivr-carousel-wrap').width(),
            crs_innerwidth = $('.ivr-carousel').width();

        if (direction == 'next') {
            new_offset = crs_offset - crs_width / 3 * 2
        } else if (direction == 'prev') {
            new_offset = crs_offset + crs_width / 3 * 2
        }

        if (new_offset > 150) {
            new_offset = crs_width / 2 - crsItemW / 2
            crsPrev.hide()
        } else {
            crsPrev.show()
        }

        if (new_offset < -crs_innerwidth + crs_width / 2 + 100) {
            new_offset = -crs_innerwidth + crs_width / 2 + crsItemW / 2 + 2
            crsNext.hide()
        } else {
            crsNext.show()
        }
        $('.ivr-carousel').css('transform', `translateX(${new_offset}px)`)
    }


    imageViewer();

    var imgobserver = new MutationObserver(function () {
        imageViewer();
    });

    imgobserver.observe(document.getElementById(container), {
        childList: true,
        subtree: true
    });
})

