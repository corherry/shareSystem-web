(function ($) {

	var $target;

	var options;

	var emotions;

	var categories;

	var emotionsMap;

	var parsingArray = [];

	var defCategory = '默认';

	var initEvents = function () {
		$('body').bind({
			click: function () {
				$('#sinaEmotion').hide();
			}
		});

		$('#sinaEmotion').bind({
			click: function (event) {
				event.stopPropagation();
			}
		}).delegate('.prev', {
			click: function (event) {
				var page = $('#sinaEmotion .categories').data('page');
				showCatPage(page - 1);
				event.preventDefault();
			}
		}).delegate('.next', {
			click: function (event) {
				var page = $('#sinaEmotion .categories').data('page');
				showCatPage(page + 1);
				event.preventDefault();
			}
		}).delegate('.category', {
			click: function (event) {
				$('#sinaEmotion .categories .current').removeClass('current');
				showCategory($.trim($(this).addClass('current').text()));
				event.preventDefault();
			}
		}).delegate('.page', {
			click: function (event) {
				$('#sinaEmotion .pages .current').removeClass('current');
				var page = parseInt($(this).addClass('current').text() - 1);
				showFacePage(page);
				event.preventDefault();
			}
		}).delegate('.face', {
			click: function (event) {
				$('#sinaEmotion').hide();
				$target.insertText($(this).children('img').prop('alt'));
				event.preventDefault();
			}
		});
	};

	var loadEmotions = function (callback) {

		if (emotions) {
			callback && callback();
			return;
		}

		if (!options) {
			options = $.fn.sinaEmotion.options;
		}

		emotions = {};
		categories = [];
		emotionsMap = {};

		$('body').append('<div id="sinaEmotion">正在加载，请稍后...</div>');

		initEvents();

		$.ajax({
			url: "http://127.0.0.1:8081/expressionController/queryExpression.do",
			type: "get",
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			success: function (data) {
				data = jQuery.parseJSON(data);
				data = data.expressionList;
				var item, category;
				$('#sinaEmotion')
					.html(
						'<div class="right"><a href="#" class="prev">«</a><a href="#" class="next">»</a></div><ul class="categories"></ul><ul class="faces"></ul><ul class="pages"></ul>');

				for (var i = 0, l = data.length; i < l; ++i) {
					item = data[i];
					category = item.category || defCategory;

					if (!emotions[category]) {
						emotions[category] = [];
						categories.push(category);
					}

					emotions[category].push({
						pic: item.pic,
						phrase: item.phrase
					});

					emotionsMap[item.phrase] = item.pic;
				}

				$(parsingArray).parseEmotion();
				parsingArray = null;

				callback && callback();
			},
			error: function (data) {
				if (data.status == 403) {
					window.location.href = "login.html";
				}
			}
		});
	};

	var showCatPage = function (page) {

		var html = '';
		var length = categories.length;
		var maxPage = Math.ceil(length / 5);

		var $categories = $('#sinaEmotion .categories');
		var category = $categories.data('category') || defCategory;
		page = (page + maxPage) % maxPage;
		for (var i = page * 5; i < length && i < (page + 1) * 5; ++i) {
			html += '<li class="item"><a href="#" class="category' +
				(category == categories[i] ? ' current' : '') + '">' +
				categories[i] + '</a></li>';
		}

		$categories.data('page', page).html(html);
	};

	var showCategory = function (category) {
		console.log(category);
		$('#sinaEmotion .categories').data('category', category);
		showFacePage(0);
	};

	var showFacePage = function (page) {

		var face;
		var html = '';
		var pageHtml = '';
		var rows = options.rows;
		var category = $('#sinaEmotion .categories').data('category');
		var faces = emotions[category];
		page = page || 0;

		for (var i = page * rows, l = faces.length; i < l &&
			i < (page + 1) * rows; ++i) {
			face = faces[i];
			html += '<li class="item"><a href="#" class="face"><img class="sina-emotion" src="' +
				face.pic + '" alt="' + face.phrase + '" /></a></li>';
		}

		$('#sinaEmotion .faces').html(html);
	};


	/**
	 * 为某个元素设置点击事件，点击弹出表情选择窗口
	 * 
	 * @param {[type]}
	 *            target [description]
	 * @return {[type]} [description]
	 */
	$.fn.sinaEmotion = function (target) {

		target = target ||
			function () {
				return $(this).parents().parents().parents('form').find(
					'textarea').eq(0);
			};

		var $that = $(this).last();
		var offset = $that.offset();

		if ($that.is(':visible')) {
			if (typeof target == 'function') {
				$target = target.call($that);
			} else {
				$target = $(target);
			}

			loadEmotions(function () {
				showCategory(defCategory);
				showCatPage(0);
			});
			$('#sinaEmotion').css({
				top: offset.top + $that.outerHeight() + 5,
				left: offset.left
			}).show();
		}

		return this;
	};

	$.fn.parseEmotion = function () {

		if (!categories) {
			parsingArray = $(this);
			loadEmotions();
		} else if (categories.length == 0) {
			parsingArray = parsingArray.add($(this));
		} else {
			$(this)
				.each(
					function () {

						var $this = $(this);
						var html = $this.html();

						html = html
							.replace(/<.*?>/g, function ($1) {
								$1 = $1.replace('[', '[');
								$1 = $1.replace(']', ']');
								return $1;
							})
							.replace(
								/\[[^\[\]]*?\]/g,
								function ($1) {
									var url = emotionsMap[$1];
									if (url) {
										return '<img class="sina-emotion" src="' +
											url +
											'" alt="' +
											$1 + '" />';
									}
									return $1;
								});

						$this.html(html);
					});
		}

		return this;
	};

	$.fn.insertText = function (text) {

		this.each(function () {

			if (this.tagName !== 'INPUT' && this.tagName !== 'TEXTAREA') {
				return;
			}
			if (document.selection) {
				this.focus();
				var cr = document.selection.createRange();
				cr.text = text;
				cr.collapse();
				cr.select();
			} else if (this.selectionStart !== undefined) {
				var start = this.selectionStart;
				var end = this.selectionEnd;
				this.value = this.value.substring(0, start) + text +
					this.value.substring(end, this.value.length);
				this.selectionStart = this.selectionEnd = start + text.length;
				this.focus();
			} else {
				this.value += text;
			}
		});

		return this;
	}

	$.fn.sinaEmotion.options = {
		rows: 84, // 每页显示的表情数
	};
})(jQuery);

function getTopicClass() {

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
				$('#topic_class').append(content);
			})
		},
		error: function (data) {
			if (data.status == 403) {
				window.location.href = "login.html";
			}
		}
	});
}

function publishTopic() {
	var topicClassId = $('.topic_class').value;
	alert(topicClassId);
}