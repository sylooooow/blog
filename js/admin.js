$(function() {

    //请求并显示数据
    $.ajax({
        url: "/getArticle", success: (result) => {
            createFirstRow();
            createArticleTable(result);
        }
    });


    //创建第一行标题
    function createFirstRow() {
        $("#articleTable").append($(
            "<tr class='first'>" +
            "<th class='th'>" +
            "<input type='checkbox'>" +
            "<lable>全选</lable>" +
            "</th>" +
            "<th class='th'>标题</th>" +
            "<th class='th'>封面</th>" +
            "<th class='th'>简介</th>" +
            "<th class='th'>主要内容</th>" +
            "<th class='th'>插图</th>" +
            "<th class='th'>评论</th>" +
            "<th class='th'>浏览</th>" +
            "<th class='th'>作者</th>" +
            "<th class='th'>发布时间</th>" +
            "<th class='th'>操作</th>" +
            "</tr>"));
    }

    //创建文章列表
    function createArticleTable(data) {
        for (let i = 0; i < data.length; i++) {
            let $articleTable = $("#articleTable");
            $articleTable.append($(
                "<tr class='tr'>" +
                "<td class='td'>" +
                "<input type='checkbox'>" +
                "</td>" +

                "<td class='td'>" + 
                   "<div>" +
                   data[i]["title"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" +
                   "<div>" +
                   data[i]["icon"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" + 
                   "<div>" +
                   data[i]["intro"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" +
                   "<div>" +
                   data[i]["content"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" +
                   "<div>" +
                   data[i]["pic"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" +
                   "<div>" +
                   data[i]["comment"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" +
                   "<div>" +
                   data[i]["browse"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" +
                   "<div>" +
                   data[i]["author"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" +
                   "<div>" +
                   data[i]["date"] + 
                   "</div>" +
                "</td>" +
                "<td class='td'>" +
                "<button class='editBtn'>编辑</button>" +
                "<button class='deleteBtn'>删除</button>" +
                "</td>" +
                "</tr>"));
        }
        $(".editBtn").click(editArticle);
        $(".deleteBtn").click(deleteArticle);
    }


    //编辑
    let editArticle = () => {

    };


    //删除
    let deleteArticle = () => {
        
    };



    //当页面尺寸发生改变的时候，设置左侧导航的显示与隐藏
    $(window).resize(function () {
        let winWidth = $(window).width();
        if (winWidth > 1250) {
            $(".left_content").show();
        } else {
            $(".left_content").hide();
        }
    });

    //点击显示隐藏或隐藏的左侧导航
    $(".hide-nav").click(() => {
        $(".left_content").slideToggle();
    });
});