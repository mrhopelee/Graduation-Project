/**
 * Created by Administrator on 2016-2-3.
 */
/*在表单中通过 GET 方法提交两个参数*/

var express = require('express');
var app = express();
var fs = require("fs");
var crud = require("./crud");
var filefun = require("./filefun");


app.set('views', './views');
app.set('view engine', 'jade');


var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var multer = require('multer');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

/*page*/
app.get('/index.html', function (req, res) {
    console.log("index.html");
    res.sendFile(__dirname + "/" + "index.html");
})
app.get('/manager.html', function (req, res) {
    console.log("manager.html");
    res.sendFile(__dirname + "/" + "manager.html");
})
app.get('/canvas.html', function (req, res) {
    console.log("manager.html");
    res.sendFile(__dirname + "/canvas/" + "index.html");
})

/*picture*/

app.get('/classimage', function (req, res) {
    crud.classImg(req, res);
})







//跳转页面
/*var managerpage = function (req, res) {
    crud.showAllImg(req, res);
}*/








/*class*/
app.get('/creclass', function (req, res) {//增加分类
    crud.creClass(req, res);
})
app.get('/delclass', function (req, res) {//删除分类
    crud.delClass(req, res);
})
app.get('/updclass', function (req, res) {//修改分类
    crud.updClass(req, res);
})
app.get('/findclassname', function (req, res) {//查询分类
    crud.findClassName(req, res);
})

/*picture*/
/*增加图片*/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {//图片上传的临时路径
        cb(null, 'public/uploadstmp')
    },
    filename: function (req, file, cb) {//表单名+时间，防止文件重名
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var uploadimg = multer({storage: storage});
app.post('/file_upload', uploadimg.array('image'), function (req, res) {
    var read_path = req.files[0].path;//图片上传的临时路径
    var imgname = req.files[0].filename + '-' + req.files[0].originalname;//图片真实名字
    var write_path = "public\\images\\" + imgname;//图片保存的路径
    /*var creclassid = "";
    if (req.body.class_id.toString() == "") {
        creclassid = "56dab2879a78ca71f18afdb6";//默认分类的id
    } else {
        creclassid = req.body.class_id;
    }*/
    var nameQuery = {"creclassid": req.body.class_id, "realname": imgname};
    /*console.log(req.files);
     console.log(req.body);*/
    fs.readFile(read_path, function (err, data) {//读取图片文件

        fs.writeFile(write_path, data, function (err) {//将图片数据data写入文件路径write_path
            if (err) {
                console.log(err);
            } else {
                crud.creatPicture(req, res, data, nameQuery);//插入图片
            }
        });
        if (fs.existsSync(read_path)) {//找到上传图片时的临时文件，删除
            fs.unlink(read_path, function (err) {//删除临时文件
                if (err) {
                    return console.error(err);
                }
                //console.log("临时文件删除成功！");
            });
        }
    });
})
/*删除图片*/
app.post('/delpicture', function (req, res) {
    crud.delPicture(req, res);
})
/*修改图片*/
app.get('/updpicture', function (req, res) {
    crud.updPicture(req, res);
})
/*查询图片*/
app.get('/showAllpicture', function (req, res) {
    crud.showAllpicture(req, res);
})

/*图片滤镜*/
app.post('/picturefilter', function (req, res) {
    /*filefun.rmdirSync("public/filterimages/",function(e){
        console.log("!!!"+e);
        console.log("删除filterimages目录以及子目录成功");
        filefun.mkdirSync("public/filterimages/",0,function(e){
            if(e){
                console.log('出错了');
                res.send(false);
            }else{
                crud.pictureFilter(req, res);
            }
        });
    })*/
    var state = filefun.deldirchild("public/filterimages/");
    if(state===true){
        crud.pictureFilter(req, res);
    }else {
        res.send(false);
    }


})
/*删除临时目录的所有文件*/
app.get('/deltempfilterpicture', function (req, res) {
    /*filefun.rmdirSync("public/filterimages/",function(e){
        console.log("!!!"+e);
        console.log("删除filterimages目录以及子目录成功");
        filefun.mkdirSync("public/filterimages/",0,function(e){
            if(e){
                console.log('出错了');
                res.send(false);
            }else{
                console.log("重新创建filterimages目录成功，退出滤镜模式")
                res.send(true);
            }
        });
    })*/
    var state = filefun.deldirchild("public/filterimages/");
    if(state){

    }
    console.log("清除filterimages目录下的临时文件成功，退出滤镜模式")
    res.send(state);
})
/*/!*临时保存图片*!/
app.post('/savetemp', function (req, res) {
    crud.savetemp(req, res);
})*/
/*保存图片到相册*/
app.post('/savegallery', function (req, res) {
    crud.savegallery(req, res);
})



var server = app.listen(27017, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

