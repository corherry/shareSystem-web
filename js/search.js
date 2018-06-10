function searchTopic(title, page, size) {
  $.ajax({
    url: "http://127.0.0.1:8081/topicController/queryTopicByTitle.do",
    type: "get",
    data: {
      title: title,
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
      if (data.list.resultList.length == 0 && page == 1) {
        $('#none-data').attr('style', "");
        $('#none-data').html('没有相关数据～');
      }
      $.each(data.list.resultList, function (index, topic) {
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
      })
      $('#topicList').append(html);
      if (page * size < data.list.totalRow) {
        $('#more-data').attr('style', 'text-align: center');
        $('#none-data').attr('style', "display:none");
      } else {
        $('#more-data').attr('style', 'text-align: center; display: none');
        $('#none-data').attr('style', "");
        $('#none-data').html('没有更多数据了～');
      }
    },
    error: function (data) {
      if (data.status == 403) {
        window.location.href = "login.html";
      }
    }
  });

}


function searchUser(userId, name, page, size) {
  $.ajax({
    url: "http://127.0.0.1:8081/userController/queryUserInfoByUserName.do",
    type: "get",
    data: {
      userId: userId,
      userName: name,
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
      if (data.list.resultList.length == 0 && page == 1) {
        $('#none-data').attr('style', "");
        $('#none-data').html('没有相关数据～');
      }
      $.each(data.list.resultList, function (index, user) {
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
      if (page * size < data.list.totalRow) {
        $('#more-data').attr('style', 'text-align: center');
        $('#none-data').attr('style', "display:none");
      } else {
        $('#more-data').attr('style', 'text-align: center; display: none');
        $('#none-data').attr('style', "");
        $('#none-data').html('没有更多数据了～');
      }
    },
    error: function (data) {
      if (data.status == 403) {
        window.location.href = "login.html";
      }
    }
  });

}