function getHomeCategory() {

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryTopicClass.do",
        type: "get",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            var content = "";
            $.each(data.topicClassList, function (index, topicClass) {
                content = "<option value='" + topicClass.id + "'>" + topicClass.typeName + "</option>";
                $('#topic_category').append(content);

            })
            renderForm();
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });

}

//重新渲染表单
function renderForm() {
    layui.use('form', function () {
        var form = layui.form;
        form.render();
    });
}

function queryUserInfo(userId, seeUserId) {

    $.ajax({
        url: "http://127.0.0.1:8081/userController/queryHomePageUserInfo.do",
        type: "get",
        data: {
            userId: userId,
            seeUserId: seeUserId,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            data = data.userInfo;
            if (userId == seeUserId) {
                $('#edit_user').attr('href', 'set.html?userId=' + userId);
            } else {
                $('#edit_user').attr("style", "display:none");
            }
            if (data.headPic) {
                $('#main_userPic').attr('src', data.headPic);
            }

            $('#user_maininfo').prepend(data.userName);
            if (data.sex == '男') {
                $('#main_userSex').attr('class', 'iconfont icon-nan');
            } else if (data.sex == '女') {
                $('#main_userSex').attr('class', 'iconfont icon-nv');
            } else {
                $('#main_userSex').attr('style', 'display:none');
            }
            $('#main_userLevel').html(data.level);
            if (data.blurb) {
                $('#main_userBlurb').html('(' + data.blurb + ')');
            }

            $('#friendUrl').attr('href', 'friendView.html?id='+seeUserId);
            $('#fansUrl').attr('href', 'fansView.html?id='+seeUserId);
            $('#homeUrl').attr('href', 'home.html?userId='+seeUserId);


            $('#friend_num').html(data.friendCount);
            $('#fans_num').html(data.fansCount);
            $('#publish_num').html(data.publishCount);
            $('#userName').html(data.userName);
            if (data.address) {
                $('#address').html(data.address);
            } else {
                $('#address').html('未填写');
            }
            if (data.sex) {
                $('#sex').html(data.sex);
            } else {
                $('#sex').html('未填写');
            }
            if (data.birthday) {
                $('#birthday').html(data.birthday);
            } else {
                $('#birthday').html('未填写');
            }
            if (data.blurb) {
                $('#blurb').html(data.blurb);
            } else {
                $('#blurb').html('未填写');
            }
            $('#createTime').html(data.createTime);
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function getHomeTopicList(userid, seeUserId, topicClassId, order, page, size) {

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryTopicByUserId.do",
        type: "get",
        data: {
            userId: userid,
            category: topicClassId,
            seeUserId: seeUserId,
            order: order,
            page: page,
            size: size
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            var html = "";
            if (data.topicList.length == 0 && page == 1) {
                $('#none-data').attr('style', "");
                $('#none-data').html('没有相关数据～');
            }
            $.each(data.topicList, function (index, topic) {
                if (!topic.headPic) {
                    topic.headPic = "../images/default_userHeadPic.gif";
                }
                html += "<li><a href='home.html?userId=" + topic.userId + "' class='fly-avatar'>";
                html += "<img src='" + topic.headPic + "' alt='" + topic.userName + "'></a>";
                html += "<h2><a class='layui-badge'>" + topic.categoryName + "</a><a href='detail.html?topicId=" + topic.topicId + "'>" + topic.title + "</a></h2>";
                html += "<div class='fly-list-info'><a href='home.html?userId=" + topic.userId + "' link><cite>" + topic.userName + "</cite></a><span>" + topic.addtime + "</span>";
                html += "<span class='fly-list-see'><i class='iconfont icon-liulanyanjing' title='查看'></i> " + topic.seeCount + "</span>";
                html += "<span class='fly-list-comment'><i class='iconfont icon-pinglun1' title='评论'></i> " + topic.commentCount + "</span>";
                html += "<span class='fly-list-nums'><i class='iconfont icon-zan' title='赞'></i> " + topic.loveCount + "</span></div></li>"
            });
            $('#topicList').append(html);
            var count = getHomeTopicMore(userid, seeUserId, topicClassId, order, page + 1, size);
            if (count == 0) {
                $('#more-data').attr('style', 'text-align: center; display: none');
                $('#none-data').attr('style', "");
                $('#none-data').html('没有更多数据了～');
            } else {
                $('#more-data').attr('style', 'text-align: center');
                $('#none-data').attr('style', "display:none");
            }
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });

}

function getHomeTopicMore(userid, seeUserId, topicClassId, order, page, size) {
    var count = 0;

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryTopicByUserId.do",
        type: "get",
        data: {
            userId: userid,
            category: topicClassId,
            seeUserId: seeUserId,
            order: order,
            page: page,
            size: size
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            count = data.topicList.length;

        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
    return count;
}

function isAttend(userId, seeUserId) {
    $('#show_addFriend').attr('style', '');

    $.ajax({
        url: "http://127.0.0.1:8081/relationController/isAttend.do",
        type: "get",
        data: {
            userId: userId,
            attendId: seeUserId
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            if (data.count == 0) {
                $('#addFriend').html('加关注');
            } else {
                $('#addFriend').html('取消关注');
            }
            $('#addFriend').attr('data-isAttend', data.count);

        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}