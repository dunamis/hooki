$(document).ready(function() {
    $('input[name=search-keyword]').keyup(function() {
        var c = $(this).val();

        if (c === '') {
            $('div.search-result').hide();
            return;
        }

        $.ajax({
            url : '/autoComplete',
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify({
                'c' : c
            }),
            success : function(data) {
                var item,
                    html;
                $('div.search-result ul.list li.item').remove();

                if (data.length == 0) {
                    $('div.search-result .no-result').removeClass('hidden');
                    return;
                }

                for (var i in data) {
                    html = data[i].title;
                    pageId = data[i].pageId;
                    html = html.replace(c, '<b>' + c + '</b>');
                    item = $('div.search-result ul.list .template').clone();
                    item.find('.link').attr('href', '/view/' + pageId);
                    item.removeClass('hidden template');
                    item.addClass('item');
                    item.find('.text').html(html);
                    $('div.search-result ul.list').append(item);
                }

                $('div.search-result .no-result').addClass('hidden');
                $('div.search-result').show();
            },
            error : function() {
            }
        });
    });
});
