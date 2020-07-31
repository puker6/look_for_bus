/**
 * Created by w-rain on 2017/3/27.
 * description
 * 信息提示层
 * 信息确认框
 * 信息提示框
 * 信息loading层
 */

"use strict";

/*animateCss*/
(function () {
    $.fn.extend({
        animateCss: function (animationName, callback) {
            let animationEnd = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
            $(this).addClass("animated " + animationName).one(animationEnd, function () {
                $(this).removeClass("animated " + animationName);
                if (callback !== null && callback !== undefined)
                    callback();
            });
        }
    });
})();
/*messagePrompt*/
(function () {
    function msg(options) {
        var self = this;
        options = options || {};
        this.opts = $.extend({}, $.misMsg.defaultOptions, options);

        function initContainer() {
            if (self.opts.element instanceof $) {
                self.container = self.opts.element.parent().css("position", "relative");
            } else {
                self.container = $("." + self.opts.containerClassName + " ");
                if (self.container.length === 0) {
                    self.container = $("<div class='" + self.opts.containerClassName + "'></div>");
                    $("body").append(self.container);
                }
            }
        }

        function initMsg() {
            self.msg = $("<div class='" + self.opts.className + "'>" + self.opts.content + "</div>");
            self.container.append(self.msg);
            if (self.opts.element instanceof $)
                self.setPosition();
        }

        function initEvent() {
            if (self.opts.clickToClose)
                self.msg.on("click", self.close.bind(self));
            if (self.opts.closeDelay !== 0)
                setTimeout(self.close.bind(self), self.opts.closeDelay);
        }
        initContainer();
        let existent = $("body").find(".mis-msg-container .mis-msg");
        if(existent.length === 0){
            initMsg();
            initEvent();
            this.open();
        }
    }

    msg.prototype.container = {};
    msg.prototype.msg = {};
    msg.prototype.open = function () {
        if (this.opts.openClassName === "")
            this.msg.fadeIn();
        else
            this.msg.animateCss(this.opts.openClassName);
    };
    msg.prototype.close = function () {
        if (this.opts.closeClassName === "")
            this.msg.fadeOut(this.destroy.bind(this));
        else
            this.msg.animateCss(this.opts.closeClassName, this.destroy.bind(this));
    };
    msg.prototype.destroy = function () {
        this.msg.remove();
        //是否删除父容器
        if (this.container.children().length === 0) {
            this.container.remove();
        }
        this.opts.closeCallback();
    };
    msg.prototype.setPosition = function () {
        let pos = this.opts.element.position(),
            w1 = this.opts.element.outerWidth(),
            h1 = this.opts.element.outerHeight(),
            w2 = this.notify.outerWidth(),
            h2 = this.notify.outerHeight(),
            top = 0,
            left = 0;
        switch (this.opts.position) {
            case "top":
                top = pos.top - h2;
                left = pos.left - (w2 - w1) / 2;
                break;
            case "bottom":
                top = pos.top + h1;
                left = pos.left - (w2 - w1) / 2;
                break;
            case "left":
                top = pos.top - (h2 - h1) / 2;
                left = pos.left - w2;
                break;
            case "rigth":
                top = pos.top - (h2 - h1) / 2;
                left = pos.left + w1;
                break;
            default:
                break;
        }
        this.msg.css({position: "absolute", top: top, left: left});
    };
    $.misMsg = function (content, options) {
        let type = typeof options === 'function';
        return new msg($.extend({}, {content: content}, type ? {} : options));
    };
    $.fn.misMsg = function (content, options) {
        let type = typeof options === 'function';
        $(this).each(function () {
            new msg($.extend({}, {element: $(this), content: content}, type ? {} : options));
        });
        return this;
    };
    $.misMsg.defaultOptions = {
        containerClassName: "mis-msg-container",
        className: "mis-msg",
        openClassName: "fadeIn",
        closeClassName: "fadeOut",
        closeDelay: 2000,
        clickToClose: true,
        closeCallback: function () {
        },
        content: "",
        element: null,
        position: "top"
    };
    $.misMsg.defaults = function (options) {
        let type = typeof options === 'function';
        $.misMsg.defaultOptions = $.extend({}, $.misMsg.defaultOptions, type ? {} : options);
    };
})();
/*alert*/
(function () {
    $.misAlert = function (data, options) {
        let content = (`<div class="alert-dialog">
				<div class="alert-header">
					<div class="alert-title">${data.title}</div>
					<a type="button" class="quit close" title="关闭"><i class="fa fa-times"></i></a>
				</div>
				<div class="alert-body">${data.content}</div>
				<div class="alert-footer">
					<button type="button" class="btn btn-default quit">关闭</button>
				</div>
			</div>`);
        let existent = $("body").find(".mis-alert-container .mis-alert"), messageExistent = $("body").find(".mis-msg-container");
        if(messageExistent) messageExistent.detach();
        if (existent.length === 0) {
            let instance = $.misMsg(content, $.extend({}, {
                containerClassName: "mis-alert-container",
                className: "mis-alert",
                closeDelay: 60 * 1000,
                clickToClose: false,
                openClassName: "fadeIn",
                closeClassName: "fadeOut"
            }, options));
            instance.msg.find(".quit").on("click", instance.close.bind(instance));
            return instance;
        }
    }
})();
/*confirm*/
(function () {
    $.misConfirm = function (data, options) {
        let type = typeof options === 'function';
        let ConfirmContent = (`<div class="alert-dialog confirm-dialog">
				<div class="alert-header">
					<div class="alert-title"><i class="fa fa-exclamation-triangle fa-fw fa-warning" aria-hidden="true"></i>&nbsp;${data.title}</div>
					<a type="button" class="quit close" title="取消"><i class="fa fa-times"></i></a>
				</div>
				<div class="alert-body">${data.content}</div>
				<div class="alert-footer">
				    <button type="button" class="btn btn-com confirm"><i class="fa fa-check">&nbsp;</i>确定</button>
					<button type="button" class="btn btn-default quit"><i class="fa fa-close">&nbsp;</i>取消</button>
				</div>
			</div>`);
        let existent = $("body").find(".mis-confirm-container .mis-confirm"), messageExistent = $("body").find(".mis-msg-container");
        if(messageExistent) messageExistent.detach();
        if (existent.length === 0) {
            let confirmInstance = $.misMsg(ConfirmContent, $.extend({}, {
                containerClassName: "mis-confirm-container",
                className: "mis-confirm",
                closeDelay: 0,
                clickToClose: false,
                openClassName: "",
                closeClassName: ""
            }, type ? {} : options));
            confirmInstance.msg.find(".confirm").on("click", function (e) {
                $(e.currentTarget).prop('disabled', true);
                let btnList = $('.confirm');
                if (btnList.length > 1) {
                    for (let i = 0; i < btnList.length; i++) {
                        if (e.target === btnList[i] && e.target.parentNode === btnList[i].parentNode) {
                            confirmInstance.close.bind(confirmInstance)();
                            if (type) options();
                        }
                    }
                } else {
                    if (e.target === btnList[0]) {
                        confirmInstance.close.bind(confirmInstance)();
                        if (type) options();
                    }
                }

            });
            confirmInstance.msg.find(".quit").on("click", confirmInstance.close.bind(confirmInstance));
            return confirmInstance;
        }
    }
})();

/*loading - 3D Cube*/
(function () {
    let loadingContent = (`<div class='cube'></div><div class='cube'></div> <div class='cube'></div><div class='cube'></div>
                           <div class='cube'></div><div class='cube'></div><div class='cube'></div> <div class='cube'></div><div class='cube'></div>`);
    $.misShow3DLoader = function () {
        $.misMsg(loadingContent, $.extend({}, {
            containerClassName: "mis-loader-container",
            className: "mis-loader",
            closeDelay: 0,
            clickToClose: false,
            openClassName: "",
            closeClassName: ""
        }, {}));
    };
    $.misHide3DLoader = function () {
        $('.mis-loader-container').remove();
    };
})();
/*loading - 2D circle*/
(function () {
    let loadingContent = (`<div class="spinner"> 
            <div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div>
             <div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div>
            <div class="spinner-container container3"> <div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div>
            </div>`);

    $.misShowLoader = function () {
        $.misMsg(loadingContent, $.extend({}, {
            containerClassName: "mis-2d-loader-container",
            className: "mis-2d-loader",
            closeDelay: 0,
            clickToClose: false,
            openClassName: "",
            closeClassName: ""
        }, {}));
    };
    $.misHideLoader = function () {
        $('.mis-2d-loader-container').remove();
    };
})();
/*loading - 2D- Rouge*/
(function () {
    let loadingContent = (`<div class="load"> <p>同步中...</p></div><div class="topRouge"></div><div class="leftRouge"></div><div class="rightRouge"></div>`);
    $.misShowRougeLoader = function () {
        $.misMsg(loadingContent, $.extend({}, {
            containerClassName: "mis-rouge-loader-container",
            className: "mis-rouge-loader",
            closeDelay: 0,
            clickToClose: false,
            openClassName: "",
            closeClassName: ""
        }, {}));
    };
    $.misHideRougeLoader = function () {
        $('.mis-rouge-loader-container').remove();
    };
})();
/*loading - 2D - Violette*/
(function () {
    let loadingContent = (`<div class="circleViolette"><div class="circleCache"></div></div><div class="load"><p>同步中</p></div><div class="point"></div>`);
    $.misShowVioletteLoader = function () {
        $.misMsg(loadingContent, $.extend({}, {
            containerClassName: "mis-violette-loader-container",
            className: "mis-violette-loader",
            closeDelay: 0,
            clickToClose: false,
            openClassName: "",
            closeClassName: ""
        }, {}));
    };
    $.misHideVioletteLoader = function () {
        $('.mis-violette-loader-container').remove();
    };
})();
/*loading - 2D - Blanche*/
(function () {
    let loadingContent = (`<div class="blanche"><div class="dot"></div></div><div class="load"><p>同步中...</p></div>`);
    $.misShowBlancheLoader = function () {
        $.misMsg(loadingContent, $.extend({}, {
            containerClassName: "mis-blanche-loader-container",
            className: "mis-blanche-loader",
            closeDelay: 0,
            clickToClose: false,
            openClassName: "",
            closeClassName: ""
        }, {}));
    };
    $.misHideBlancheLoader = function () {
        $('.mis-blanche-loader-container').remove();
    };
})();
/*drag verify method 1*/
(function ($) {
    $.fn.drag = function (data, options) {
        let x, drag = this, isMove = false, defaults = {};
        let dragOptions = $.extend(defaults, options);
        //添加背景，文字，滑块
        let html = '<div class="drag_bg"></div>' +
            '<div class="drag_text" onselectstart="return false;" unselectable="on">拖动滑块验证</div>' +
            '<div class="handler handler_bg"><i class="fa fa-angle-double-right" aria-hidden="true"></i></div>';
        this.append(html);

        let handler = drag.find('.handler');
        let drag_bg = drag.find('.drag_bg');
        let text = drag.find('.drag_text');
        let maxWidth = drag.width() - handler.width();  //能滑动的最大间距

        //鼠标按下时候的x轴的位置
        handler.mousedown(function (e) {
            isMove = true;
            x = e.pageX - parseInt(handler.css('left'), 10);
        });

        //鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
        $(document).mousemove(function (e) {
            let _x = e.pageX - x;
            if (isMove) {
                if (_x > 0 && _x <= maxWidth) {
                    handler.css({'left': _x});
                    drag_bg.css({'width': _x});
                } else if (_x > maxWidth) {  //鼠标指针移动距离达到最大时清空事件
                    dragComplete();
                    data.params.isverify = 'true';
                }
            }
        }).mouseup(function (e) {
            isMove = false;
            let _x = e.pageX - x;
            if (_x < maxWidth) { //鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
                handler.css({'left': 0});
                drag_bg.css({'width': 0});
            }
        });

        //清空事件
        function dragComplete() {
            handler.addClass('handler_complete_bg').find('i.fa').removeClass('fa-angle-double-right').addClass('fa-check-circle');
            text.text('验证通过');
            drag.css({'color': '#fff'});
            handler.unbind('mousedown');
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
        }
    };
})(jQuery);
/*drag verify method 2*/
(function ($) {
    function Slider(elem, options) {
        this.$container = elem;
        this.default = {
            width: this.$container[0].clientWidth > 328 ? 328 : this.$container[0].clientWidth,
            height: this.$container[0].clientHeight,
            bgColor: '#E8E8E8',
            progressColor: '#00C7C1',
            handleColor: '#fff',
            succColor: '#00C7C1',
            text: '请按住滑块，拖动到最右边',
            succText: '验证通过',
            textColor: '#333',
            succTextColor: '#fff',
            successFunc: function () {
            }
        };
        this.options = $.extend({}, this.default, options);
        this.isSuccess = false;
    }

    Slider.prototype = {
        create: function () {
            let $container = this.$container;
            let options = this.options;
            initDOM();
            initStyle();

            function initDOM() {
                let template = '<div class="slide-to-unlock-bg"><span>' +
                    options.text +
                    '</span></div><div class="slide-to-unlock-progress"></div><div class="slide-to-unlock-handle"><i class="fa fa-angle-double-right" aria-hidden="true"></i></div>';
                $container.html(template);
            }

            function initStyle() {
                $container.css({
                    position: 'relative',
                });
                $container.find('span').css({
                    lineHeight: options.height + 'px',
                    fontSize: options.height / 3,
                    color: options.textColor
                });
                $container.find('.slide-to-unlock-bg').css({
                    width: options.width + 'px',
                    height: options.height + 'px',
                    backgroundColor: options.bgColor,
                });
                $container.find('.slide-to-unlock-progress').css({
                    backgroundColor: options.progressColor,
                    height: options.height + 'px'
                });
                $container.find('.slide-to-unlock-handle').css({
                    backgroundColor: options.handleColor,
                    height: options.height + 'px',
                    lineHeight: options.height + 'px',
                    width: (Math.floor(options.width / 8)) + 'px',
                });
            }
        },
        bindDragEvent: function () {
            let that = this;
            let $container = this.$container;
            let options = this.options;
            let downX;
            let $prog = $container.find('.slide-to-unlock-progress'),
                $bg = $container.find('.slide-to-unlock-bg'),
                $handle = $container.find('.slide-to-unlock-handle');
            let succMoveWidth = $bg.width() - $handle.width();
            $handle.on('mousedown', null, mousedownHandler);

            function getLimitNumber(num, min, max) {
                if (num > max) {
                    num = max;
                } else if (num < min) {
                    num = min;
                }
                return num;
            }

            function mousedownHandler(event) {
                downX = event.clientX;
                $(document).on('mousemove', null, mousemoveHandler);
                $(document).on('mouseup', null, mouseupHandler);
            }

            function mousemoveHandler(event) {
                let moveX = event.clientX;
                let diffX = getLimitNumber(moveX - downX, 0, succMoveWidth);
                $prog.width(diffX);
                $handle.css({
                    left: diffX
                });
                if (diffX === succMoveWidth) {
                    success();
                }
                event.preventDefault();
            }

            function mouseupHandler(event) {
                if (!that.isSuccess) {
                    $prog.animate({
                        width: 0
                    }, 100);
                    $handle.animate({
                        left: 0
                    }, 100);
                }
                $(document).off('mousemove', null, mousemoveHandler);
                $(document).off('mouseup', null, mouseupHandler);
            }

            function success() {
                $prog.css({
                    backgroundColor: options.succColor,
                });
                $container.find('span').css({
                    'color': options.succTextColor,
                    '-webkit-text-fill-color': '#fff'
                });
                $container.find('.slide-to-unlock-handle').addClass('slide-to-handle-complete').children('i.fa').removeClass('fa-angle-double-right').addClass('fa-check-circle');
                that.isSuccess = true;
                $container.find('span').html(options.succText);
                $handle.off('mousedown', null, mousedownHandler);
                $(document).off('mousemove', null, mousemoveHandler);
                setTimeout(function () {
                    options.successFunc && options.successFunc();
                }, 30);
            }
        }
    };
    $.fn.extend({
        slideToUnlock: function (options) {
            return this.each(function () {
                let slider = new Slider($(this), options);
                slider.create();
                slider.bindDragEvent();
            });
        }
    });
})(jQuery);