$(document).ready(function() {
    $('.header .search-box input').keyup(function() {
        var c = $(this).val();

        if (c === '') {
            $('div.search-result').hide();
            return;
        }

        $.ajax({
            url : '/ajax/search',
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
                    serial = data[i].sn;
                    html = html.replace(c, '<b>' + c + '</b>');
                    item = $('div.search-result ul.list .template').clone();
                    item.find('.link').attr('href', '/hooki/read/' + serial);
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

    $(document).ready(function() {
        $('.login-form').submit(function(event) {
            var email = $('.login-form input.email').val();
            var password = $('.login-form input.pwd').val();

            if (!email || !password) {
                $('.login-form .login-fail-msg').text('아이디 / 패스워드를 입력하세요');
                return false;
            }

            $.ajax({
                url : '/account/login',
                method : 'POST',
                contentType : 'application/json',
                data : JSON.stringify({
                    email : email,
                    password : password
                }),
                success : function(data) {
                    if (data.success) {
                        window.location = '/';
                    } else {
                        $('.login-form .login-fail-msg').text(data.msg);
                    }
                },
                error : function() {
                }
            });

            event.preventDefault();
        });
    });

});
