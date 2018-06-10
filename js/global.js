function getUserId() {
    var loginId = getCookie("token");
    return loginId;
}

function queryMyHeadInfo(userId) {
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
            }
            $('#head_username').html(data.userName);
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function getCookie(name) { //获取一个cookie  
    var strCookie = document.cookie;
    var arr = strCookie.split(';');
    for (var i = 0; i < arr.length; i++) {
        var t = arr[i].split("=");
        if (t[0] == name) {
            return t[1];
        }
    };
    return null;
}

function setCookie(c_name, value, expireTime) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + expireTime);
    document.cookie = c_name + "=" + escape(value) +
        ((expireTime == null) ? "" : ";expires=" + exdate.toGMTString() + ";path=/")
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return '';
}

function setHomeUrl() {
    var userId = getUserId();
    $('#my_home').attr('href', 'home.html?userId=' + userId);
}

function logout() {
    var userId = getUserId();

    $.ajax({
        url: "http://127.0.0.1:8081/tokenController/logout.do",
        data: {
            id: userId
        },
        type: "get",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            window.location.href = "login.html";
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function parseContent(content) {
    console.log(content);
    //支持的html标签
    var html = function (end) {
        return new RegExp('\\n*\\[' + (end || '') + '(pre|hr|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
    };
    content = content
        .replace(/@(\S+)(\s+?|$)/g, '<a href="javascript:;" class="fly-aite" data-name="$1" onclick="findUser(this)">@$1</a>$2') //转义@
        .replace(/\[([^\s\[\]]+?)\]/g, function (face) { //转义表情
            var alt = face.replace(/^face/g, '');
            var flag = 0;
            var cnt = alt;
            $.each(expression, function (index, exp) {
                if (exp.phrase == alt) {
                    flag = 1;
                    cnt = '<img style="width:22px;height:22px" alt="' + alt + '" title="' + alt + '" src="' + exp.pic + '">';
                    return false;
                }
            });

            return cnt;

        })
        .replace(/\n/g, '<br>') //转义换行   
    return content;
}

function search() {
    var text = $('#search_text').val();
    var type = $('#search_select').val();
    if (type == 1) {
        window.location.href = "searchTopic.html?title=" + text;
    } else if (type == 2) {
        window.location.href = "searchUser.html?name=" + text;
    }
}

function queryFriendByUserId(userId, seeUserId, page, size, order, descOrAsc) {
    $.ajax({
        url: "http://127.0.0.1:8081/relationController/findFriendByUserId.do",
        type: "get",
        data: {
            userId: userId,
            seeUserId: seeUserId,
            page: page,
            size: size,
            order: order,
            ascOrDesc: descOrAsc
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            var html = "";
            if (data.relationUserList.length == 0 && page == 1) {
                $('#none-data').attr('style', "");
                $('#none-data').html('没有相关数据～');
            }
            $.each(data.relationUserList, function (index, user) {
                if (!user.headPic) {
                    user.headPic = "../images/default_userHeadPic.gif";
                }
                html += "<li style='padding-left: 80px;height: 80px'><a href='home.html?userId=" + user.userId + "' class='fly-avatar'>";
                html += "<img src='" + user.headPic + "' alt='" + user.userName + "' style='height: 80px;width: 80px'></a>";

                if (user.userId != userId) {
                    html += "<div class='fly-sns' data-user='' style='float: right' id='show_addFriend'>";
                    if (user.isAttend == 1) {
                        html += "<a href='javascript:;' class='layui-btn layui-btn-primary fly-imActive' data-type='addFriend' id='addFriend' data-isattend='1' data-id='" + user.userId + "' onclick='changeRelation(this)'>取消关注</a></div>";
                    } else {
                        html += "<a href='javascript:;' class='layui-btn layui-btn-primary fly-imActive' data-type='addFriend' id='addFriend' data-isattend='0' data-id='" + user.userId + "' onclick='changeRelation(this)'>加关注</a></div>";
                    }
                }

                html += "<div class='fly-list-info' style='margin-left: 25px'><a href='home.html?userId=" + user.userId + "'><span>" + user.userName + "</span></a></div>";
                html += "<div class='fly-list-info' style='margin-left: 25px'>";
                if (user.sex) {
                    html += "<span style='padding-right: 2px'>" + user.sex + "</span>";
                }
                html += "<i class='layui-badge fly-badge-vip' id='userLevel' style='padding-right: 2px'>" + user.level + "</i>&nbsp;";
                if (user.address) {
                    html += "<span>" + user.address + "</span>";
                }
                html += "</div><div class='fly-list-info' style='margin-left: 25px'>";
                html += "<a style='color: #999'>关注&nbsp;<span>" + user.friendCount + "</span></a>&nbsp;&nbsp";
                html += "<a style='color: #999'>粉丝&nbsp;<span>" + user.fansCount + "</span></a>&nbsp;&nbsp";
                html += "<a style='color: #999'>发布&nbsp;<span>" + user.publishCount + "</span></a></div>";
                if (!user.blurb) {
                    user.blurb = "无";
                }
                html += "<div class='fly-list-info' style='margin-left: 25px'><span>简介:" + user.blurb + "</span></div></li>";

            })
            $('#userList').append(html);
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
    var count = getFriendMore(userId, seeUserId, page + 1, size, order, descOrAsc);
    console.log(count);
    if (count == 0) {
        $('#more-data').attr('style', 'text-align: center; display: none');
        $('#none-data').attr('style', "");
        $('#none-data').html('没有更多数据了～');
    } else {
        $('#more-data').attr('style', 'text-align: center');
        $('#none-data').attr('style', "display:none");
    }
}

function getFriendMore(userId, seeUserId, page, size, order, descOrAsc) {
    var count = 0;
    $.ajax({
        url: "http://127.0.0.1:8081/relationController/findFriendByUserId.do",
        type: "get",
        data: {
            userId: userId,
            seeUserId: seeUserId,
            page: page,
            size: size,
            order: order,
            ascOrDesc: descOrAsc
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            count = data.relationUserList.length;
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
    return count;
}

function queryFansByUserId(userId, seeUserId, page, size, order, descOrAsc) {
    $.ajax({
        url: "http://127.0.0.1:8081/relationController/findFansByUserId.do",
        type: "get",
        data: {
            userId: userId,
            seeUserId: seeUserId,
            page: page,
            size: size,
            order: order,
            ascOrDesc: descOrAsc
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            var html = "";
            if (data.relationUserList.length == 0 && page == 1) {
                $('#none-data').attr('style', "");
                $('#none-data').html('没有相关数据～');
            }
            $.each(data.relationUserList, function (index, user) {
                if (!user.headPic) {
                    user.headPic = "../images/default_userHeadPic.gif";
                }
                html += "<li style='padding-left: 80px;height: 80px'><a href='home.html?userId=" + user.userId + "' class='fly-avatar'>";
                html += "<img src='" + user.headPic + "' alt='" + user.userName + "' style='height: 80px;width: 80px'></a>";

                if (user.userId != userId) {
                    html += "<div class='fly-sns' data-user='' style='float: right' id='show_addFriend'>";
                    if (user.isAttend == 1) {
                        html += "<a href='javascript:;' class='layui-btn layui-btn-primary fly-imActive' data-type='addFriend' id='addFriend' data-isattend='1' data-id='" + user.userId + "' onclick='changeRelation(this)'>取消关注</a></div>";
                    } else {
                        html += "<a href='javascript:;' class='layui-btn layui-btn-primary fly-imActive' data-type='addFriend' id='addFriend' data-isattend='0' data-id='" + user.userId + "' onclick='changeRelation(this)'>加关注</a></div>";
                    }
                }

                html += "<div class='fly-list-info' style='margin-left: 25px'><a href='home.html?userId=" + user.userId + "'><span>" + user.userName + "</span></a></div>";
                html += "<div class='fly-list-info' style='margin-left: 25px'>";
                if (user.sex) {
                    html += "<span style='padding-right: 2px'>" + user.sex + "</span>";
                }
                html += "<i class='layui-badge fly-badge-vip' id='userLevel' style='padding-right: 2px'>" + user.level + "</i>&nbsp;";
                if (user.address) {
                    html += "<span>" + user.address + "</span>";
                }
                html += "</div><div class='fly-list-info' style='margin-left: 25px'>";
                html += "<a style='color: #999'>关注&nbsp;<span>" + user.friendCount + "</span></a>&nbsp;&nbsp";
                html += "<a style='color: #999'>粉丝&nbsp;<span>" + user.fansCount + "</span></a>&nbsp;&nbsp";
                html += "<a style='color: #999'>发布&nbsp;<span>" + user.publishCount + "</span></a></div>";
                if (!user.blurb) {
                    user.blurb = "无";
                }
                html += "<div class='fly-list-info' style='margin-left: 25px'><span>简介:" + user.blurb + "</span></div></li>";

            })
            $('#userList').append(html);
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
    var count = getFansMore(userId, seeUserId, page + 1, size, order, descOrAsc);
    console.log(count);
    if (count == 0) {
        $('#more-data').attr('style', 'text-align: center; display: none');
        $('#none-data').attr('style', "");
        $('#none-data').html('没有更多数据了～');
    } else {
        $('#more-data').attr('style', 'text-align: center');
        $('#none-data').attr('style', "display:none");
    }
}

function getFansMore(userId, seeUserId, page, size, order, descOrAsc) {
    var count = 0;
    $.ajax({
        url: "http://127.0.0.1:8081/relationController/findFansByUserId.do",
        type: "get",
        data: {
            userId: userId,
            seeUserId: seeUserId,
            page: page,
            size: size,
            order: order,
            ascOrDesc: descOrAsc
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            count = data.relationUserList.length;
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
    return count;
}