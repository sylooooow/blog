$(function () {
    //保存数据库的数据数量
    let dataBaseNum = 0;
    //定义当前页数
    let pageNum = 1;
    //保存分页的总页数
    let totalPage = 0;
    //保存当前激活分页按钮
    let pageTarget = null;
    //保存搜索结果的数量
    let searchNum = null;
    //标记进行网络请求时是搜索还是正常加载,为了在点击上一页或这一页时区分数据类型
    let isSearch = false;
    //保存搜索的文章名
    let title = "";

    //请求并显示数据,每页显示10条数据
    showData(searchNum, pageNum);
    function showData(searchNum, pageNum) {
        //先清空文章列表
        $("#articleTable").html("");
        $.ajax({
            url: "/getArticle?pageNum=" + pageNum,
            success: (result) => {
                //创建列表表头
                createFirstRow();
                //创建列表内容
                createArticleTable(result);
                //获取数据库数据的数目
                //searchNum:搜索后传入的数据个数
                //pageNum:当期的页数
                dataBaseCount(searchNum, pageNum);
            }
        });
    }
    


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



    //获取数据库中数据数量的函数
    function dataBaseCount(searchNum, pageNum) {
        //判断searchNum,如果为真说明进行了搜索,否则进入正常加载
        if (searchNum) {
            if (searchNum > 10) {
                //根据数据的数量创建底部分页
                createPages(searchNum, pageNum);
            } else {
                //此时查询的结果数量小于10,不显示分页
                $(".pagination").html("");
            }
        } else {
            $.ajax({
                url:"/getCount",
                success:(result) => {
                    dataBaseNum = result.length;
                    //判断数据数量是否大于10,是则创建分页,否则不创建
                    if (dataBaseNum > 10) {        
                        //根据数据的数量创建底部分页 参数:数据数目,当前页数
                        createPages(dataBaseNum, pageNum);
                    }
                }
            });
        }
    }



    //创建分页函数 参数:数据数目,当前页数
    function createPages(dataNum, pageNum) {
        //根据传来的数据数计算页数
        totalPage = Math.ceil(dataNum / 10);

        //获取分页ul
        let ul = $(".pagination");
        //创建前先清空ul
        ul.html("");
        //创建上一页按钮
        ul.append(
            $(
                `<li class="toPreviousPage">
                <span aria-label="Previous"><span aria-hidden="true">&laquo;</span></span>
                </li>`
            )
        );
        //给上一页按钮绑定点击事件
        $(".toPreviousPage").on('click', toPreviousPage);


        //根据页数循环创建分页点击按钮
        for(let i = 1; i <= totalPage; i++) {
            ul.append(
                $(
                    `<li class="nowPage"><span>${i}</span></li>`
                )
            );
        }
        //给分页按钮绑定点击事件
        $(".nowPage").on('click', pageJump);


        //创建下一页按钮
        ul.append(
            $(
                `<li class="toNextPage">
                <span aria-label="Next"><span aria-hidden="true">&raquo;</span></span>
                </li>`
            )
        );
        //给下一页按钮绑定点击事件
        $(".toNextPage").on('click', toNextPage);


        //给分页切换时按钮设置背景色
        //先清空所有按钮的背景色
        $(".nowPage").find("span").css("background-color",""); 
        $(".nowPage").eq(pageNum - 1).find("span").css("background-color","#EEEEEE");
    }



    //上一页点击函数
    function toPreviousPage(ev) {
        pageNum --;
        //判断如果当前页数是否小于第一页,则点击上一页总是等于第一页
        if (pageNum < 1) {
            pageNum = 1;
        } else {
            //判断isSreach的状态,区分请求数据是搜索还是正常加载
            if (isSearch) {
                //进行搜索的第二次网络请求,获取10条数据
                getSearchData(searchNum, pageNum, title);
            } else {
                //请求并显示数据,每页显示10条数据
                showData(searchNum,pageNum);
            }
        }
    }



    //下一页点击函数
    function toNextPage(){
        pageNum ++;
        //判断如果当前页数是否大于总页数,是则点击下一页总是等于最大页数
        if (pageNum > totalPage) {
            pageNum = totalPage;
        } else {
            //判断isSreach的状态,区分请求数据是搜索还是正常加载
            if (isSearch) {
                //进行搜索的第二次网络请求,获取10条数据
                getSearchData(searchNum, pageNum, title);
            } else {
                //请求并显示数据,每页显示10条数据
                showData(searchNum,pageNum);
            }
        }
    };


    //分页中数字li的跳转函数
    function pageJump(ev) {
        //获取当前点击的是第几页,并赋值给pageNum
        let page = ev.target.innerHTML;
        pageNum = Number(page);
        //判断isSreach的状态,区分请求数据是搜索还是正常加载
        if (isSearch) {
            //进行搜索的第二次网络请求,获取10条数据
            getSearchData(searchNum, pageNum, title);
        } else {
            //请求并显示数据,每页显示10条数据
            showData(searchNum,pageNum);
        }
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
        title = $("#searchText").val().trim();
        if(title != "") {
            //改变isSearch为true,表示状态为搜索
            isSearch = true;
            //重新设置pageNum为1,使搜索结果显示为第一页
            pageNum = 1;

            //第一次网络请求,获取查询结果的数量
            $.ajax({
                url: "/searchCount?title=" + title,
                type: "get",
                success:(result) => {
                    searchNum = result.length;
                    //第二次网络请求,获取10条数据
                    getSearchData(searchNum, pageNum, title);
                }
            });
        }
    });

    //查询的第二次网络请求函数
    function getSearchData(searchNum, pageNum, title) {
        $.ajax({
            url: "/search?title=" + title + "&pageNum=" + pageNum,
            type: "get",
            success: (result) => {
                if (result) {
                    //如果有返回结果,则清空文章列表重新创建,显示搜索结果
                    $("#articleTable").html("");
                    createFirstRow();
                    createArticleTable(result);
                    dataBaseCount(searchNum, pageNum);
                }
            }
        });
    }




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