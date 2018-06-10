function queryMyInfo(userId) {

    $.ajax({
        url: "http://127.0.0.1:8081/userController/findUserById.do",
        type: "get",
        data: {
            userId: userId
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            data = data.user;
            if (data.headPic) {
                $('#head_userPic').attr('src', data.headPic);
                $('#show_headPic').attr('src', data.headPic);
            }
            $('#head_username').html(data.userName);
            $('#show_name').html(data.userName);
            if (data.address) {
                $('#show_address').html(data.address);
            } else {
                $('#show_address').html('未填写');
            }
            if (data.sex) {
                $('#show_sex').html(data.sex);
            } else {
                $('#show_sex').html('未填写');
            }
            if (data.birthday) {
                $('#show_birthday').html(data.birthday);
            } else {
                $('#show_birthday').html('未填写');
            }
            if (data.blurb) {
                $('#show_blurb').html(data.blurb);
            } else {
                $('#show_blurb').html('未填写');
            }
            $('#show_addtime').html(data.addtime);
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}