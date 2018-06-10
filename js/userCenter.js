function queryRelationTopicCount(userId) {

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryRelationTopicCount.do",
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
            data = data.topicCount;
            $('#myCount').html(data.publishCount);
            $('#collectCount').html(data.collectCount);
            $('#loveCount').html(data.loveCount);
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function queryMyTopic(userId, page, size) {

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryMyTopic.do",
        type: "get",
        data: {
            userId: userId,
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
                html += "<li><a class='jie-title' href='detail.html?topicId=" + topic.id + "' target='_blank'>" + topic.title + "</a>";
                html += "<i>" + topic.addtime + "</i>";
                html += "<em>" + topic.seeCount + "阅/" + topic.commentCount + "答/" + topic.loveCount + "赞</em></li>";
            })
            $('#mytopicList').append(html);
            var count = queryMyTopicMore(userId, page + 1, size);
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

function queryMyCollectionTopic(userId, page, size) {

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryCollectTopic.do",
        type: "get",
        data: {
            userId: userId,
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
                $('#none-data1').attr('style', "");
                $('#none-data1').html('没有相关数据～');
            }
            $.each(data.topicList, function (index, topic) {
                html += "<li><a class='jie-title' href='detail.html?topicId=" + topic.id + "' target='_blank'>" + topic.title + "</a>";
                html += "<i>收藏于 " + topic.addtime + "</i>";
                html += "<em>" + topic.seeCount + "阅/" + topic.commentCount + "答/" + topic.loveCount + "赞</em></li>";
            })
            $('#collectList').append(html);
            var count = queryMyCollectionTopicMore(userId, page + 1, size);
            if (count == 0) {
                $('#more-data1').attr('style', 'text-align: center; display: none');
                $('#none-data1').attr('style', "");
                $('#none-data1').html('没有更多数据了～');
            } else {
                $('#more-data1').attr('style', 'text-align: center');
                $('#none-data1').attr('style', "display:none");
            }
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function queryMyLoveTopic(userId, page, size) {

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryLoveTopic.do",
        type: "get",
        data: {
            userId: userId,
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
                $('#none-data2').attr('style', "");
                $('#none-data2').html('没有相关数据～');
            }
            $.each(data.topicList, function (index, topic) {
                html += "<li><a class='jie-title' href='detail.html?topicId=" + topic.id + "' target='_blank'>" + topic.title + "</a>";
                html += "<i>点赞于 " + topic.addtime + "</i>";
                html += "<em>" + topic.seeCount + "阅/" + topic.commentCount + "答/" + topic.loveCount + "赞</em></li>";
            })
            $('#loveList').append(html);
            var count = queryMyLoveTopicMore(userId, page + 1, size);
            if (count == 0) {
                $('#more-data2').attr('style', 'text-align: center; display: none');
                $('#none-data2').attr('style', "");
                $('#none-data2').html('没有更多数据了～');
            } else {
                $('#more-data2').attr('style', 'text-align: center');
                $('#none-data2').attr('style', "display:none");
            }
        },
        error: function (data) {
            if (data.status == 403) {
                window.location.href = "login.html";
            }
        }
    });
}

function queryMyTopicMore(userId, page, size) {
    var count = 0;

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryMyTopic.do",
        type: "get",
        async: false,
        data: {
            userId: userId,
            page: page,
            size: size
        },
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

function queryMyCollectionTopicMore(userId, page, size) {
    var count = 0;

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryCollectTopic.do",
        type: "get",
        async: false,
        data: {
            userId: userId,
            page: page,
            size: size
        },
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

function queryMyLoveTopicMore(userId, page, size) {
    var count = 0;

    $.ajax({
        url: "http://127.0.0.1:8081/topicController/queryLoveTopic.do",
        type: "get",
        async: false,
        data: {
            userId: userId,
            page: page,
            size: size
        },
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