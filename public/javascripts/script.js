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