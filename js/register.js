$(function () {

    //点击注册
    $("#register").click(() => {

        //验证用户名、密码
        let nickName = $("#nickname").val();
        let userName = $("#username").val();
        let passWord = $("#password").val();
        let repeat_pwd = $("#repeat_pwd").val();

        if(nickName != "" && userName != "" && passWord != "" && repeat_pwd != "") {
            //判断两次输入的密码是否相同
            if (passWord === repeat_pwd) {
                $.ajax({
                    url:"/register?nickname=" + nickName + "&username=" + userName + "&password=" + passWord,
                    success:(result) => {
                        if (result == "0") {
                            alert("昵称已存在!");
                        } else if (result == "2") {
                            alert("用户名已存在!");
                        } else {
                            console.log("注册成功!");
                            location.href = "/login.html";
                        }
                    }
                });
            } else {
                alert("两次密码输入不一致,请重试!");
            }
        } else {
            alert("您填写的信息不完整,请重试!");
        }
    
    });


});