/**
 * Created by Administrator on 2016-2-3.
 */
/*在表单中通过 GET 方法提交两个参数*/

var express = require('express');
var app = express();
var fs = require("fs");
var crud = require("./crud");


app.set('views', './views');
app.set('view engine', 'jade');


var bodyParser = require('body-parser');
var multer  = require('multer');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));


app.get('/index.html', function (req, res) {
    console.log("index.html1");
    res.sendFile( __dirname + "/" + "index.html" );
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploadstmp')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var uploadimg = multer({storage:storage});
app.post('/file_upload', uploadimg.array('image'),  function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    var read_path = req.files[0].path;
    var imgname = req.files[0].filename + '-' + req.files[0].originalname;
    var write_path = "public\\images\\" + imgname;
    var classname="";
    if (req.body.classname.toString()==""){
        classname = "56dab2879a78ca71f18afdb6";//默认分类的id
    } else {
        classname = req.body.classname;
    }
    var nameQuery = {'classname': classname ,'realname': imgname};
    fs.readFile( read_path, function (err, data) {

        fs.writeFile(write_path, data, function (err) {
            if( err ){
                console.log( err );
            }else{
                crud.creatImg(req,res,data,nameQuery);
            }
        });
        if(fs.existsSync(read_path)){
            fs.unlink(read_path, function(err) {
                if (err) {
                    return console.error(err);
                }
                //console.log("临时文件删除成功！");
            });
        }
    });
    //console.log(write_path);
    //console.log(fs.existsSync(write_path));
    /*fs.unlink(read_path, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("文件删除成功！");
    });*/
    /*console.log(read_path);
    console.log(write_path);
    console.log(classname);
    console.log(req.files);*/
})

app.get('/manager.html', function (req, res) {
    crud.showAllImg(req,res);
})
app.get('/classimage', function (req, res) {
    crud.classImg(req,res);
})


app.post('/image_del', urlencodedParser, function (req, res) {
    crud.removeImg(req, res);
})

//跳转页面
var managerpage=function (req, res) {
    crud.showAllImg(req,res);
}

/*class*/
app.get('/findclassname', function (req, res) {
    crud.findClassName(req, res);
})
app.get('/creclass', function (req, res) {
    crud.creClass(req, res);
})
app.get('/delclass', function (req, res) {
    crud.delClass(req, res);
})

var server = app.listen(27017, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

