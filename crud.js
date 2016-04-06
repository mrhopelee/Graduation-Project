/**
 * Created by Administrator on 2016-3-3.
 */
var str = 'mongodb://' + 'localhost' + ':' + '27017' + '/' + 'gp';
var db = require('mongoskin').db(str);
var imageinfo = require("./imageinfo");
var fs = require("fs");



/*按分类查询图片*/
function classImg(req, res) {
    /*console.log(req.query.thisclassid);*/
    if (req.query.thisclassid == "") {
        db.collection('picture').find().toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.send(result);
        });
    } else {
        db.collection('picture').find({class: req.query.thisclassid}).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            res.send(result);
        });
    }
}
exports.classImg = classImg;




/*finish*/

/*class*/
/*新增分类*/
function creClass(req, res) {
    db.collection('class').insert({name: req.query.newclassname}, function (err, result) {
        if (err) throw err;
        if (!err) console.log('id:' + req.query.newclassname + ' ' + ' creClass!');
        findClassName(req, res);
    });
}
exports.creClass = creClass;
/*删除分类*/
function delClass(req, res) {
    /*console.log(req.query.classid);*/
    db.collection('class').removeById(req.query.classid, function (err, result) {
        if (err) throw err;
        if (!err) console.log('id:' + req.query.classid + ' ' + ' delClass!');


        db.collection('picture').find({class: req.query.classid}, function(err, result) {

            result.each(function(err, picture) {
                if(picture){
                    /*console.log(picture);
                    console.log(picture._id);
                    console.log(picture.name);*/
                    db.collection('picture').updateById(picture._id, {$set: {class: "56dab2879a78ca71f18afdb6"}}, function (err, result) {
                        if (err) throw err;
                        if (!err) console.log('图片:' + picture.name +  ' 修改为 56dab2879a78ca71f18afdb6  updClass!');
                    });
                }

            });
        });



        findClassName(req, res);
    });
}
exports.delClass = delClass;
/*修改分类*/
function updClass(req, res) {
    db.collection('class').updateById(req.query.this_classid, {$set: {name: req.query.upd_classname}}, function (err, result) {
        if (err) throw err;
        if (!err) console.log('分类id:' + req.query.this_classid + ' 分类名:' + req.query.this_classname + ' 修改为 ' + req.query.upd_classname + ' updClass!');
        findClassName(req, res);
    });
}
exports.updClass = updClass;
/*查询所有分类*/
function findClassName(req, res) {
    db.collection('class').find(req.query.query).toArray(function (err, result) {
        if (err) throw err;
        console.log("查询所有分类");
        res.send(result);
    })
}
exports.findClassName = findClassName;

/*picture*/
/*插入图片*/
function creatPicture(req, res, data, nameQuery) {
    var now = new Date();//创建时间
    var info = imageinfo(data);//获取图片基本数据
    //console.log(info);
    /*插入图片*/
    db.collection('picture').insert({//插入数据库
        name: req.files[0].originalname,
        realname: nameQuery.realname,
        date: [now.getYear(), now.getMonth(), now.getDate()],
        height: info.height,
        width: info.width,
        size: data.length,
        class: nameQuery.creclassid,
        tag: []
    }, function (err, result) {
        if (err) throw err;
        if (!err) console.log('Added!');
        var query = {class:nameQuery.creclassid};//获取当前分类
        if(nameQuery.creclassid==''){
            query = {};
        }
        //console.log(query);
        db.collection('picture').find(query).toArray(function (err, result) {//查询当前分类的图片
            if (err) throw err;
            //console.log(result);
            //res.render('manager',{pi:result});
            //res.redirect('./hello.html');
            res.send(result);
        })
    });
}
exports.creatPicture = creatPicture;
/*删除图片*/
function delPicture(req, res) {
    console.log(req.body.del_pictureid + ' delPicture!');
    db.collection('picture').findById(req.body.del_pictureid, function (err, result) {//根据id在数据库中查找图片
        var del_path = "public\\images\\" + result.realname;//图片真实路径
        //if (!err) console.log(del_path);
        db.collection('picture').removeById(req.body.del_pictureid, function (err, result) {//根据id在数据库中删除图片
            if (!err) {
                //console.log(req.body.id + ' deleted!');
                if (fs.existsSync(del_path)) {//通过真实路径删除真实文件
                    fs.unlink(del_path, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        var query = {class:req.body.thisclass};
                        if(req.body.thisclass==''){
                            query = {};
                        }
                        db.collection('picture').find(query).toArray(function (err, result) {//查询当前分类的图片
                            if (err) throw err;
                            //console.log(result);
                            //res.render('manager',{pi:result});
                            //res.redirect('./hello.html');
                            res.send(result);
                        })
                    });
                }
            }
        });
    });
}
exports.delPicture = delPicture;
/*修改图片分类*/
function updPicture(req, res) {
    //console.log(req.query.upd_classid);
    // console.log(req.query.upd_classname);
    /*通过图片id修改图片分类class*/
    db.collection('picture').updateById(req.query.upd_pictureid, {$set: {class: req.query.upd_classid}}, function (err, result) {
        if (err) throw err;
        if (!err) console.log('id:' + req.query.upd_pictureid + ' class:' + req.query.upd_classid + ' pictureUpdateClass!');

        /*console.log(req.query.old_classid);*/

        res.send(req.query);
    });
}
exports.updPicture = updPicture;
/*查询图片*/
function showAllpicture(req, res) {
    var query = req.query.query;
    //console.log(query);
    db.collection('picture').find(query).toArray(function (err, result) {
        if (err) throw err;
        //console.log(result);
        //res.render('manager',{pi:result});
        //res.redirect('./hello.html');
        res.send(result);
    })
}
exports.showAllpicture = showAllpicture;

function copyPicture(ole_path,new_path){

}

/*图片滤镜*/
function pictureFilter(req, res) {
    db.collection('picture').findById(req.body.thispicture, function (err, result) {//根据id在数据库中查找图片
        var this_path = "public\\images\\" + result.realname;//图片真实路径
        var filter_path = "public\\filterimages\\" + result.realname;//图片滤镜处理临时路径
        //if (!err) console.log(del_path);
        if (fs.existsSync(this_path)) {
            fs.readFile(this_path, function (err, data) {//读取图片源文件
                fs.writeFile(filter_path, data, function (err) {//将图片数据data写入文件路径filter_path
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result.name + "进入滤镜模式");
                        res.send(result);
                    }
                });

            });
        }
        /*var query = {class:req.body.thisclass};
        if(req.body.thisclass==''){
            query = {};
        }
        db.collection('picture').find(query).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            //res.render('manager',{pi:result});
            //res.redirect('./hello.html');
            res.send(result);
        })*/
        /*db.collection('picture').removeById(req.body.del_pictureid, function (err, result) {//根据id在数据库中删除图片
            if (!err) {
                //console.log(req.body.id + ' deleted!');
                if (fs.existsSync(del_path)) {//通过真实路径删除真实文件
                    fs.unlink(del_path, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        var query = {class:req.body.thisclass};
                        if(req.body.thisclass==''){
                            query = {};
                        }
                        db.collection('picture').find(query).toArray(function (err, result) {//查询当前分类的图片
                            if (err) throw err;
                            //console.log(result);
                            //res.render('manager',{pi:result});
                            //res.redirect('./hello.html');
                            res.send(result);
                        })
                    });
                }
            }
        });*/
    });
}
exports.pictureFilter = pictureFilter;

