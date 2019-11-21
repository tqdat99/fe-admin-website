$('#pagination-demo').twbsPagination({
    totalPages: 16,
    visiblePages: 6,
    next: 'Next',
    prev: 'Prev',
    onPageClick: function(event, page) {
        var path = window.location.href;
        tokens = path.split("-");
        newPath = tokens[0] + "-" + tokens[1] + "-" + page;
        console.log(path);
        console.log(newPath);
        window.location.href = newPath;
        // if (path != new Path) {
        //     window.location.href = newPath;
        //     window.location.href = 'https://www.google.com.vn/';

        // }

        $('#page-content').text('Page ' + page + newPath);

    }
});

$('.tile')
    // tile mouse actions
    .on('mouseover', function() {
        $(this).children('.photo').css({ 'transform': 'scale(' + $(this).attr('data-scale') + ')' });
    })
    .on('mouseout', function() {
        $(this).children('.photo').css({ 'transform': 'scale(1)' });
    })
    .on('mousemove', function(e) {
        $(this).children('.photo').css({ 'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 + '%' });
    })
    // tiles set up
    .each(function() {
        $(this)
            // add a photo container
            .append('<div class="photo"></div>')
            // some text just to show zoom level on current item in this example
            .append('<div class="txt"><div class="x">' + $(this).attr('data-scale') + 'x</div>ZOOM ON<br>HOVER</div>')
            // set up a background image for each tile based on data-image attribute
            .children('.photo').css({ 'background-image': 'url(' + $(this).attr('data-image') + ')' });
    })