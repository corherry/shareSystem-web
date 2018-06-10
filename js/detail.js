var expression = "";

function getExpression() {
    $.ajax({
        url: "http://127.0.0.1:8081/expressionController/queryExpression.do",
        type: "get",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            expression = data.expressionList;
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function queryTopicDetail(userId, topicId) {

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryTopicDetail.do",
        type: "get",
        data: {
            userId: userId,
            topicId: topicId,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            data = data.topicDetail;
            $('#title').prepend(data.title);
            $('#category').html(data.category);
            $('#see').html("&nbsp;" + data.seeCount);
            $('#see').attr('data-seeCount', data.seeCount);
            $('#comment').html("&nbsp;" + data.commentCount);
            $('#comment').attr('data-commentCount', data.commentCount);
            $('#zancount').html("&nbsp;" + data.loveCount);
            $('#zancount').attr('data-loveCount', data.loveCount);
            if (userId == data.userId) {
                $('#show_authority').attr('style', 'display: inline-block; float: right; ');
                $('#authority').val(data.authority);
                layui.use('form', function () {
                    var form = layui.form;
                    form.render();
                });
                $('#delete').attr('style', '');
            }
            if (data.isLoved == 1) {
                $('#zan').attr('style', 'color: #c00');
            }
            $('#zan').attr('data-isLoved', data.isLoved);
            $('#link_pic').attr('href', 'home.html?userId=' + data.userId);
            $('#headPic').attr('alt', data.userName);
            if (data.headPic) {
                $('#headPic').attr('src', data.headPic);
            }
            $('#link_name').attr('href', 'home.html?userId=' + data.userId);
            $('#userName').html(data.userName);
            $('#level').html(data.level);
            $('#addtime').html("发布于 " + data.addtime);
            if (data.isCollected > 0) {
                $('#collect').html('取消收藏').addClass('layui-btn-danger');
            } else {
                $('#collect').html('收藏');
            }
            $('#collect').attr('data-isCollected', data.isCollected);
            $('#topic_content').html(parseContent(data.content));
            if (data.picGroup) {
                var picHtml = "";
                $.each(data.picGroup, function (index, pic) {
                    picHtml += "<img src='" + pic + "'>";
                });
                $('#picGroup').append(picHtml);
                layui.use('carousel', function () {
                    var carousel = layui.carousel;
                    //建造实例
                    carousel.render({
                        elem: '#test1',
                        width: '400px' //设置容器宽度
                    });
                });
            } else {
                $('#test1').attr('style', 'margin:auto;display:none');
            }
            layui.form.render();
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

$('#zan').bind('click', function () {
    var type = $('#zan').attr('data-isLoved');

    $.ajax({
        url: "http://127.0.0.1:8081/loveController/updateLove.do",
        type: "get",
        data: {
            topicId: topicId,
            userId: userId,
            op: type
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            var count = $('#zancount').attr('data-loveCount');
            if (type == 0) {
                count++;
                $('#zan').attr('data-isLoved', 1).attr('style', 'color: #c00');
                $('#zancount').attr('data-loveCount', count);
                $('#zancount').html("&nbsp;" + count);
                layer.msg("点赞成功!<br>经验值+" + data.point);
            } else {
                count--;
                $('#zan').attr('data-isLoved', 0).attr('style', '');
                $('#zancount').attr('data-loveCount', count);
                $('#zancount').html("&nbsp;" + count);
                layer.msg("取消点赞成功!<br>经验值" + data.point);
            }
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
})

function updateAuthority(topicId, authority) {

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/updateAuthority.do",
        type: "get",
        data: {
            topicId: topicId,
            authority: authority
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            if (data.result == 1) {
                layer.msg("帖子权限设置成功！");
            } else {
                layer.msg("系统异常，请重试！");
            }
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function findUser(obj) {
    var name = $(obj).attr('data-name');

    $.ajax({
        url: "http://127.0.0.1:8081/userController/isUnameExisted.do",
        type: "get",
        data: {
            userName: name
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            if (data.result > 0) {
                window.open("home.html?userId=" + data.result);
            } else {
                layer.msg("该昵称用户不存在！");
            }
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function addComment(userId, topicId, content) {

    $.ajax({
        url: "http://127.0.0.1:8081/commentController/add.do",
        type: "get",
        data: {
            userId: userId,
            topicId: topicId,
            content: content
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            var point = data.point;
            if (point > 0) {
                layer.msg("评论成功！<br>经验值+" + point);
            } else {
                layer.msg("评论成功！");
            }
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function queryComment(topicId, page, size) {
    var userid = getUserId();

    $.ajax({
        url: "http://127.0.0.1:8081/commentController/queryComment.do",
        type: "get",
        data: {
            topicId: topicId,
            page: page,
            size: size
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            data = data.commentInfoList;
            var html = "";
            if (page == 1 && data.length == 0) {
                $('#none-comment').attr('style', '');
                $('#demo1').attr('style', 'display:none');
            }
            $.each(data, function (index, comment) {
                if (!comment.headPic) {
                    comment.headPic = "../images/default_userHeadPic.gif";
                }
                html += "<li data-id='" + comment.id + "'> <div class='detail-about detail-about-reply'>";
                html += "<a class='fly-avatar' href='home.html?userId=" + comment.userId + "'>";
                html += "<img src='" + comment.headPic + "'></a>";
                html += "<div class='fly-detail-user'><a href='home.html?userId=" + comment.userId + "' class='fly-link'><cite>" + comment.userName + "</cite></a></div>";
                html += "<div class='detail-hits'><span>" + comment.addtime + "</span></div></div>";
                html += "<div class='detail-body jieda-body photos'><p>" + parseContent(comment.content) + "</p></div>";
                html += "<div class='jieda-reply'><span type='reply' onclick='reply(this)'><i class='iconfont icon-svgmoban53'></i>回复</span>";
                if (userid == comment.userId) {
                    html += "<div class='jieda-admin'><span type='del' onclick='deleteTopic(this)'>删除</span></div>";
                }
                html += "</div></li>";
                $('#jieda').html(html);

            })
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function queryCommentCount(topicId) {
    $.ajax({
        url: "http://127.0.0.1:8081/commentController/queryCommentCount.do",
        type: "get",
        data: {
            topicId: topicId,
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            data = jQuery.parseJSON(data);
            commentCount = data.count;
            layui.use(['laypage', 'layer'], function () {
                var laypage = layui.laypage,
                    layer = layui.layer;

                //总页数大于页码总数
                laypage.render({
                    elem: 'demo1',
                    count: commentCount, //数据总数
                    jump: function (obj) {
                        queryComment(topicId, obj.curr, size);
                    }
                });
            });
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function reply(obj) {
    var li = $(obj).parents('li');
    var val = $('#L_content').val();
    var aite = '@' + li.find('.fly-detail-user cite').text().replace(/\s/g, '');
    $('#L_content').focus();
    if (val.indexOf(aite) !== -1) return;
    $('#L_content').val(aite + ' ' + val);
}

function deleteTopic(obj) {
    var id = $(obj).parents('li').attr('data-id');
    layer.confirm('确认删除该回答么？', function (index) {
        layer.close(index);

        $.ajax({
            url: "http://127.0.0.1:8081/commentController/delete.do",
            type: "get",
            data: {
                id: id,
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                layer.msg("删除成功");
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            },
            error: function (data) {
                if (data.status == 403) {
                    window.location.href = "login.html";
                }
            }
        });
    });
}

function updateSeeCount(userId, topicId) {

    $.ajax({
        url: "http://127.0.0.1:8081/seeController/updateSeeCount.do",
        type: "get",
        async: false,
        data: {
            userId: userId,
            topicId: topicId
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}