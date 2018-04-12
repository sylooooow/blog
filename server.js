//引入模块
const express = require("express");
const mongoose = require("mongoose");
const formidable = require("formidable");
const fs = require("fs");

//初始化express
let app = express();

//连接数据库
let url = "mongodb://127.0.0.1:27017/blog";
let db = mongoose.connect(url, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("数据库连接成功!");
    }
});

//schema: 一种以文件形式存储的数据模型骨架
//用户模型
let userSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: Number
    },
    nickname: {
        type: String,
        default: ""
    },
    icon: {
        type: String,
        default: ""
    }
}, {
    collection: "user"
});
//model 由schema构造生成的数据模型
let userModel = mongoose.model("user", userSchema);

//管理员模型
let adminSchema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: Number
    },
    nickname: {
        type: String,
        default: ""
    },
    article: {
        type: Number
    },
    comment: {
        type: Number
    },
    icon: {
        type: String,
        default: ""
    }
}, {
    collection: "admin"
});
let adminModel = mongoose.model("admin", adminSchema);

//文章列表模型
let articleSchema = new mongoose.Schema({
    title: {
        type: String
    },
    icon: {
        type: String
    },
    intro: {
        type: String
    },
    content: {
        type: String
    },
    classify: {
        type: String
    },
    comment: {
        type: Number,
        default: 0
    },
    browse: {
        type: Number,
        default: 0
    },
    author: {
        type: String,
        default: "yanziye"
    },
    date: {
        type: String
    }
}, {
    collection: "article"
});
let articleModel = mongoose.model("article", articleSchema);


//默认接口,登陆页
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

//用户登陆接口
app.get("/login", (req, res) => {
    //查询数据库里是否有前台输入的用户名
    userModel.findOne({
        username: req.query.username
    }, (err, doc) => {
        if (err) {
            console.error(err);
            console.log("没有");
        } else {
            if (doc) {
                //判断密码是否一致
                if (req.query.password == doc["password"]) {
                    console.log("登陆成功!");
                    res.send("1");
                } else {
                    console.log("密码错误!");
                    res.send("2");
                }
            } else {
                console.log("用户名不存在!");
                res.send("0");
            }
        }
    })
});

//管理员登陆接口
app.get("/adminLogin", (req, res) => {
    //查询数据库里是否有前台输入的用户名
    adminModel.findOne({
        username: req.query.username
    }, (err, doc) => {
        if (err) {
            console.error(err);
            console.log("没有");
        } else {
            if (doc) {
                //判断密码是否一致
                if (req.query.password == doc["password"]) {
                    console.log("登陆成功!");
                    res.send("1");
                } else {
                    console.log("密码错误!");
                    res.send("2");
                }
            } else {
                console.log("用户名不存在!");
                res.send("0");
            }
        }
    });
});

//注册接口
app.get("/register", (req, res) => {
    //查询数据库里所有的用户
    userModel.find({}, (err, doc) => {
        if (err) {
            console.error(err);
        } else {
            //标记是否可以注册
            let flag = true;

            //遍历所有用户,先查询昵称是否重复,再看用户名,如果有重名则改变flag
            for (let i = 0; i < doc.length; i++) {
                if (req.query.nickname == doc[i]["nickname"]) {
                    console.log("昵称已存在!");
                    res.send("0");
                    flag = false;
                    break;
                } else if (req.query.username == doc[i]["username"]) {
                    console.log("用户名已存在!");
                    res.send("2");
                    flag = false;
                    break;
                }
            }
            //如果用户名和昵称均可用,此时flag为true,向数据库里添加用户
            if (flag) {
                userModel.create({
                    username: req.query.username,
                    password: req.query.password,
                    nickname: req.query.nickname
                }, (err, doc) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("注册成功!");
                        res.send("1");
                    }
                });
            }
        }
    });
});





//后台默认接口,登录页
app.get("/admin", (req, res) => {
    res.sendFile(__dirname + "/admin_login.html");
});


//后台登录接口
app.get("/admin_login", (req, res) => {
    //查询数据库里是否有前台输入的用户名
    adminModel.findOne({
        username: req.query.username
    }, (err, doc) => {
        if (err) {
            console.error(err);
            console.log("没有");
        } else {
            if (doc) {
                //判断密码是否一致
                if (req.query.password == doc["password"]) {
                    console.log("登陆成功!");
                    res.send("1");
                } else {
                    console.log("密码错误!");
                    res.send("2");
                }
            } else {
                console.log("用户名不存在!");
                res.send("0");
            }
        }
    });
});

//获取数据库里所有数据,前端以此来计算数据的数量
app.get("/getCount", (req, res) => {
    articleModel.find({}, (err, doc) => {
        res.send(doc);
    });
});



//主页请求文章列表
app.get("/getArticle", (req, res) => {
    //获取前台传来的当前是第几页
    let pageNum = (req.query.pageNum - 1) * 10;
    articleModel.find({}, null, {
        skip: pageNum,
        limit: 10
    }, (err, doc) => {
        if (err) {
            console.error(err);
        } else {
            console.log("获取文章数据成功");
            res.send(doc);
        }
    });
});


//添加文章
app.post("/add", (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, args, file) => {
        if (err) {
            console.error(err);
        } else {
            let iconName = file["article_icon"]["name"];
            let iconWriteStream = file["article_icon"]["path"];
            console.log("上传的图片名称:" + iconName);
            console.log("上传的图片路径" + iconWriteStream);

            //把上传的图片复制到本地
            let rs = fs.createReadStream(iconWriteStream);
            let ws = fs.createWriteStream("./img/article/" + iconName);
            rs.pipe(ws);

            //把上传的文章信息写入数据库
            articleModel.create({
                title: args["article_title"],
                icon: iconName,
                intro: args["article_intro"],
                content: args["article_main"],
                classify: args["article_classify"],
                date: getDate()
            }, (err, doc) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log("添加文章成功!");
                    res.send("1");
                }
            });
        }
    });
});


//删除文章
app.get("/delete", (req, res) => {
    articleModel.remove({
        title: req.query.title
    }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("删除文章成功!");
            res.send("1");
        }
    });
});


//批量删除
app.get("/deleteById", (req, res) => {
    articleModel.remove({
        _id: req.query.id
    }, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log("删除文章成功!");
            res.send("1");
        }
    });
});



//修改文章
app.post("/modify", (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, args, file) => {
        if (err) {
            console.error(err);
        } else {
            //判断文件类型是否是对象,如果是说明前台上传了图片
            if (typeof (file["modify_icon"]) == "object") {
                //获取图片名
                let iconName = file["modify_icon"]["name"];
                //获取文件路径
                let iconWriteStream = file["modify_icon"]["path"];
                //把上传的图片复制到本地
                let rs = fs.createReadStream(iconWriteStream);
                let ws = fs.createWriteStream("./img/article/" + iconName);
                rs.pipe(ws);

                //写入数据库(更新)
                articleModel.update({
                    _id: args["targetId"]
                }, {
                    $set: {
                        title: args["modify_title"],
                        icon: iconName,
                        intro: args["modify_intro"],
                        content: args["modify_main"],
                        classify: args["modify_classify"],
                        date: getDate()
                    }
                }, {
                    multi: true
                }, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("修改数据库成功!");
                        res.send("1");
                    }
                });
            } else {
                //此时表示没有新上传图片,修改数据时不需要传入图片
                //写入数据库(更新)
                articleModel.update({
                    _id: args["targetId"]
                }, {
                    $set: {
                        title: args["modify_title"],
                        intro: args["modify_intro"],
                        content: args["modify_main"],
                        classify: args["modify_classify"],
                        date: getDate()
                    }
                }, {
                    multi: true
                }, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("修改数据库成功!");
                        res.send("1");
                    }
                });
            }
        }
    });
});



//查询文章
app.get("/search", (req, res) => {
    //获取前台传来的当前是第几页,每次返回10条数据
    let pageNum = (req.query.pageNum - 1) * 10;
    let reg = new RegExp(req.query.title, 'i');
    articleModel.find({
        title: {
            $regex: reg
        }
    }, null, {
        skip: pageNum,
        limit: 10
    }, (err, doc) => {
        if (err) {
            console.error(err);
        } else {
            res.send(doc);
        }
    });
});

//查询数量
app.get("/searchCount", (req, res) => {
    let reg = new RegExp(req.query.title, 'i');
    articleModel.find({title:{$regex: reg}}, (err, doc) => {
        res.send(doc);
    });
});


//加载关联的css和js文件
app.all("*", (req, res) => {
    res.sendFile(__dirname + req.path);
});

//监听端口
app.listen(8080, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log("服务器启动成功!");
    }
});


/************** 功能函数 **************/

//获取当前时间函数
let getDate = () => {
    //创建时间对象
    let nowDate = new Date();
    let year = nowDate.getFullYear();
    let month = nowDate.getMonth() + 1;
    let day = nowDate.getDate();
    let hour = nowDate.getHours();
    let minute = nowDate.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    //拼接时间
    let date = year + "-" + month + "-" + day + " " + hour + ":" + minute;
    return date;
};