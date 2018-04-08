$(function () {

    //点击登陆
    $("#login").click(() => {

        //验证用户名、密码和用户类型
        let userName = $("#username").val();
        let passWord = $("#password").val();
        let userType = $("#user_type").val();

        if (userName != "" && passWord != "") {
            //根据不同用户类型,做不同网络请求
            if (userType == 0) {
                console.log("普通用户");
                $.ajax({
                    url:"/login?username=" + userName + "&password=" + passWord,
                    success:(result) => {
                        //根据服务器不同反馈,做不同处理。
                        if (result == 0) {
                            alert("用户名不存在!");
                        } else if (result == 2) {
                            alert("密码错误!");
                        } else {
                            console.log("登陆成功!");
                            location.href = "/index.html";
                            //禁止页面返回
                            location.replace("index.html");
                        }
                    } 
                });
            } else {
                console.log("管理员");
                $.ajax({
                    url:"/adminLogin?username=" + userName + "&password=" + passWord,
                    success:(result) => {
                        //根据服务器不同反馈,做不同处理。
                        if (result == 0) {
                            alert("用户名不存在!");
                        } else if (result == 2) {
                            alert("密码错误!");
                        } else {
                            console.log("登陆成功!");
                            location.href = "/index.html";
                            //禁止页面返回
                            location.replace("index.html");
                        }
                    } 
                });
            }       
        } else {
            alert("您提交的信息不完整,请重试!");
        }
    });
});

