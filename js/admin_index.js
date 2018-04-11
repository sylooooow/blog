$(function () {

    //请求并显示数据
    $.ajax({
        url: "/getArticle",
        success: (result) => {
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
            "<th class='th'>内容</th>" +
            "<th class='th'>分类</th>" +
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
                "<div class='article-icon'>" +
                `<img src='../img/article/${data[i]["icon"]}'>` +
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
                data[i]["classify"] +
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
                "<button class='editBtn' data-toggle='modal' data-target='#modifyModal'>修改</button>" +
                "<button class='deleteBtn'>删除</button>" +
                "</td>" +
                "</tr>"));
        }
        $(".editBtn").click(editArticle);
        $(".deleteBtn").click(deleteArticle);
    }


    //添加
    $("#add").click(() => {
        //使用FormData对象实现图片上传
        let formData = new FormData();

        //获取填写的值
        let title = $("#article_title").val();
        let iconObj = $("#article_icon").get(0).files[0];
        let intro = $("#article_intro").val();
        let main = $("#article_main").val();
        let classify = $("#article_classify").val();

        formData.append("article_title", title);
        formData.append("article_icon", iconObj);
        formData.append("article_intro", intro);
        formData.append("article_main", main);
        formData.append("article_classify", classify);
        console.log(formData);

        //网络请求
        $.ajax({
            type: 'POST',
            url: "/add",
            data: formData,
            contentType: "application/x-www-form-urlencoded",
            async: false,
            processData: false,
            contentType: false,
            success: (result) => {
                if (result == "1") {
                    console.log("添加文章成功!");
                    alert("添加成功!");
                    location.reload(true);
                }
            }
        });
    });



    //修改
    let editArticle = (ev) => {
        //根据事件对象获取当前点击的目标对应的文章名
        let article = ev.target.parentNode.parentNode.children[1].children[0].innerHTML;
        //根据文章名去请求数据库,返回该文章的信息
        $.ajax({
            type: "get",
            url: "/search?title=" + article,
            success: (result) => {
                //根据返回的文章信息,添加编辑弹出框中的值
                $("#modify_title").val(result[0]["title"]);
                // $("#modify_icon").val(result[0]["icon"]);
                $("#modify_intro").val(result[0]["intro"]);
                $("#modify_main").val(result[0]["content"]);
                $("#modify_classify").val(result[0]["classify"]);

                //点击确认修改,根据返回的文章id进行数据库查询,从而指定的文章
                $("#modify").click(() => {
                    let targetId = result[0]["_id"];
                    let formData = new FormData();

                    formData.append("targetId", targetId);
                    formData.append("modify_title", $("#modify_title").val());
                    formData.append("modify_intro", $("#modify_intro").val());
                    formData.append("modify_main", $("#modify_main").val());
                    formData.append("modify_classify", $("#modify_classify").val());

                    //判断是否重新传入了图片
                    let iconObj = $("#modify_icon").get(0).files[0];
                    if (typeof (iconObj) == "object") {
                        formData.append("modify_icon", iconObj);
                    }

                    //网络请求
                    $.ajax({
                        type: 'POST',
                        url: "/modify",
                        data: formData,
                        contentType: "application/x-www-form-urlencoded",
                        async: false,
                        processData: false,
                        contentType: false,
                        success: (result) => {
                            if (result == "1") {
                                console.log("修改文章成功!");
                                alert("修改成功!");
                                location.reload(true);
                            }
                        }
                    });
                });
            }
        });
    };


    //删除
    let deleteArticle = (ev) => {
        let msg = "确定要删除吗?";
        if (confirm(msg)) {
            //根据事件对象获取当前点击的目标对应的文章名
            let article = ev.target.parentNode.parentNode.children[1].children[0].innerHTML;
            //根据当前文章名进行网络请求
            $.ajax({
                url: "/delete?title=" + article,
                type: "get",
                success: (result) => {
                    if (result == "1") {
                        console.log("删除成功!");
                        alert("删除文章成功!");
                        location.reload(true);
                    }
                }
            });
        }
    };



    //查询
    $(".long_search_btn").click(() => {
        //如果输入框为空时点击查询,无效果
        let title = $("#searchText").val().trim();
        if(title != "") {
            $.ajax({
                url: "/search?title=" + title,
                type: "get",
                success: (result) => {
                    if (result) {
                        //如果有返回结果,则清空文章列表重新创建,显示搜索结果
                        $("#articleTable").html("");
                        createFirstRow();
                        createArticleTable(result);
                    }
                }
            });
        }
    });




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
})