$(function () {
    //点击登陆
    $("#login").click(() => {
        //验证用户名、密码和用户类型
        let userName = $("#username").val();
        let passWord = $("#password").val();
        let userType = $("#user_type").val();

        if (userName != "" && passWord != "") {
            //网络请求
            $.ajax({
                url: "/admin_login?username=" + userName + "&password=" + passWord,
                success: (result) => {
                    //根据服务器不同反馈,做不同处理。
                    if (result == 0) {
                        alert("用户名不存在!");
                    } else if (result == 2) {
                        alert("密码错误!");
                    } else {
                        console.log("登陆成功!");
                        location.href = "/admin_index.html";
                        //禁止页面返回
                        location.replace("admin_index.html");
                    }
                }
            });
        } else {
            alert("您提交的信息不完整,请重试!");
        }
    });
});

