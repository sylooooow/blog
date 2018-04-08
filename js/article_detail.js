//页面加载完触发
$(document).ready(function () {

    /********************* 返回顶部函数 ********************/
    toTop();
    function toTop() {
        var $toTopBtn = $("#toTop");
        var winh = $(window).height();
        //使按钮在屏幕下方
        $toTopBtn.css("top", winh - $toTopBtn.outerHeight() * 1.25);

        //当页面尺寸发生改变的时候，改变按钮的位置
        $(window).resize(function () {
            console.log("ss");
            var winh = $(window).height();
            $toTopBtn.css("top", winh - $toTopBtn.outerHeight() * 1.25);
        })

        //点击事件
        $toTopBtn.click(function () {
            $("html, body").animate({
                scrollTop: 0
            }, 300);
        })

        //如果滚动条滚动,按钮出现,否则隐藏
        $(window).scroll(function () {
            //滚动条距离顶部的距离
            var st = $(document).scrollTop();
            (st > 0) ? $toTopBtn.show() : $toTopBtn.hide();
        })
    }


    /**************** 隐藏菜单和搜索点击显示函数 ***************/
    showHideMenu();
    function showHideMenu() {
        //隐藏菜单点击事件
        $("#hideMenu").click(function () {
            $(".hide_nav_menu").slideToggle(200);
        });
        //隐藏搜索点击事件
        $("#hideSearch").click(function () {
            $(".hide_search").slideToggle(200);
        });
    }

})







