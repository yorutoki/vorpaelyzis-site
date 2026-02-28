$(document).ready(function(){

    makefooter()
    makeheader()

    $('.menubutton').click(function(){
        $('.headerlinks').slideToggle()
        $('.headerlinksbg').fadeToggle()
    })
    $('.headerlinksbg').click(function(){
        $('.headerlinks').slideToggle()
        $('.headerlinksbg').fadeToggle()
    })

    if (location.hash.length > 0) {
        hash = location.hash.substring(1)
        window.setTimeout(function(){

            if (typeof imagesLoaded === 'function') {
                $('body').imagesLoaded().always(function(){
                    location.hash = hash
                })
            } else {location.hash = hash}
        },100)
    }

    $('[id^="gallery-"]').each(function(){
        const id = $(this).attr('id').replace(/gallery-/, ''),
        folder = '../img/' + id;
        makegallery(folder, this)
    })

    markdown()
    doll()
    tabber()
})


/*
function makegallery(folder, dest, grid){
    $.ajax({
        url: folder,
        dataType: "html",
        success: function (data) {
            $(data).find("a").attr("href", function (i, val) {
                if (val.match(/\.(jpe?g|png|gif)$/)) {
                    $(dest).append("<div class='gallery-item is-loading'><img src='.." + val + "' width='300px' class=''></div>");
                }
            });
            $(dest).imagesLoaded().progress(function(i, image){
                $(image.img).parent().removeClass('is-loading');
            })

            if (grid) {
            var $grid = $(dest).masonry({
                itemSelector:'.gallery-item',
                fitWidth:true
            })
            $grid.imagesLoaded().progress(function(i, image){
                $grid.masonry('layout');
            })
            }
        }
    });
}
*/

function makegallery(folder, dest, grid){
    $.get(folder, function(data){
            $(data).find("a").attr("href", function (i, val) {
                if (val.match(/\.(jpe?g|png|gif)$/)) {
                    $(dest).append("<div class='gallery-item is-loading'><img src='.." + val + "' width='300px' class=''></div>");
                }
            });
            $(dest).imagesLoaded().progress(function(i, image){
                $(image.img).parent().removeClass('is-loading');
            })

            if (grid) {
            var $grid = $(dest).masonry({
                itemSelector:'.gallery-item',
                fitWidth:true
            })
            $grid.imagesLoaded().progress(function(i, image){
                $grid.masonry('layout');
            })
            }
    });
}

function makefooter() {
    $("#main").append(`<div id="footer">© vorpaelyzis 2026 <div class="doll footerdoll"><img src="../img/faust` + getRandomInt(3) + `.png" ></div></div>`)
}

function makeheader() {
    $("body").prepend(`    <div id="header">
    <a class="menubutton">menu</a>
    <div class="headerlinks">
        <a class="headerlink" alt="home" href="../home">home</a>
        <a class="headerlink" alt="portfolio" href="../portfolio">portfolio</a>
        <a class="headerlink" alt="commission" href="../commission">commission</a>
        <a class="headerlink" alt="terms-of-service" href="../terms-of-service">terms</a>
        <a class="headerlink" alt="about" href="../about">about me</a>  
    </div>
    <div class="headerlinksbg"></div></div>`)

    page = $('body').attr('data-page')
    $('.headerlinks').find('[alt=' + page + ']').addClass('active').attr('href', '')

}
function maketoc() {
        var toc = "";
        var level = 0;
        var headers = 'h1, h2, h3'
        var whitelist = $('#toc').attr('data-headers')
        if (whitelist != undefined) {
            headers = whitelist
        }

        $('#main').find(headers).each(function(){
            openLevel = parseInt($(this).prop('nodeName').slice(1))
            titleText = $(this).text()

            if (openLevel > level) {
                toc += (new Array(openLevel - level + 1)).join("<ul>");
            } else if (openLevel < level) {
                toc += (new Array(level - openLevel + 1)).join("</ul>");
            }

            level = parseInt(openLevel);

            var anchor = titleText.replace(/ /g, "_");
            toc += "<li><a href=\"#" + anchor + "\">" + titleText + "</a></li>";

            $(this).attr('id', anchor)
        })

        if (level) {
            toc += (new Array(level + 1)).join("</ul>");
        }

        $('#toc').append(toc)
        
        mobiletocbutton()

        scrolloverride = false

        $('#main').scroll(function(){findactivesection(headers)})
        findactivesection(headers)

        $('#toc').find('a').click(function(){
            scrolloverride = true
            $('#toc').find('.active').removeClass('active');
            $(this).closest('li').addClass('active');
            setTimeout(function(){scrolloverride = false},1000)
        })


}

function findactivesection(header){
    if (!scrolloverride) {
        var activesection = ""
        $('#main').find(header).each(function(){
            if ($(this).offset().top < 200) {
                activesection = $(this).attr("id")
            } else {return}
        })
        
            $('#toc').find('.active').removeClass('active');
            $('#toc').find("[href='#" + activesection + "']").closest('li').addClass('active');
    }
}



function markdown() {
    if (typeof markdownit === 'function') {
        const md = markdownit({
            html: true
        })
        $('[id^="markdownit-"]').each(function(){
            const el = $(this).attr('id').replace(/^(.*)/, "#$1")
                const page = el.replace("#markdownit-", "")
        
                $.ajax({
                    url: '../markdown/' + page + '.md',
                    success: function(data) {
                        $(el).append(md.render(data));
                        if ($('#toc').length > 0) {
                            maketoc()
                        }
                    }
                });
            })
    }
}

function mobiletocbutton() {
        $('body').append('<div id="mobile-toc-button"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg></div>')
        $('#mobile-toc-button').click(function () {
            $('#toc').fadeToggle()
        })

        $('#toc a').click(function () {
            if ($(window).width() < 701) {
                $('#toc').fadeToggle()
            }
        })

}

function doll() {
    if ($(".doll").length > 0) {
        const squeak = new Audio("../asset/squeak.mp3");
        squeak.volume = 0.2;
        $('.doll').click(function(){
            squeak.play()
            const e = $(this)
            e.removeClass('bounce')
            setTimeout(function(){e.removeClass('bounce')}, 500)
            e.addClass('bounce')
        })
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
}

function tabber(){
    $('.tabber').each(function(){
        var tabber = $(this)
        tabber.find('.tabbutton').click(function(){
            tabber.find('.tabbutton').removeClass('active');
            $(this).addClass('active');
            
            if ($('#main').scrollTop() > 0) {tabber[0].scrollIntoView()}

            const thistab = '#' + $(this).attr('data-tab');
            tabber.find('.tab').hide();
            tabber.find('.tab' + thistab).fadeIn();
        })

        if (location.hash.length > 0) {
            hash = location.hash.substring(1)
            console.log(hash)
            $('.tabbutton[data-tab="' + hash + '"]').click()
        } else {
            tabber.find('.tabbutton').eq(0).click()
        }
    })
}