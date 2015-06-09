$(document).ready(function() {
    $('input[name=search-keyword]').keyup(function() {
        var c = $(this).val();

        if(c === '') {
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
                var html = '<ul>';
                for(var i in data) {
                    html += '<li>' + data[i].title + '</li>';
                }
                html +='</ul>';
                $('div.search-result').html(html);
                $('div.search-result').show();
            },
            error : function() {
            }
        });
    });
});
