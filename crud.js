/**
 * Created by Administrator on 2016-3-3.
 */
var str = 'mongodb://' + 'localhost' + ':' + '27017' + '/' + 'gp';
var db = require('mongoskin').db(str);
var imageinfo = require("./imageinfo");
var fs = require("fs");

/*插入图片*/
function creatPicture(req, res, data, nameQuery) {
    var now = new Date();
    var info = imageinfo(data);
    db.collection('picture').insert({
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
        var query = {class:nameQuery.creclassid};
        if(nameQuery.creclassid==''){
            query = {};
        }
        //console.log(query);
        db.collection('picture').find(query).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            //res.render('manager',{pi:result});
            //res.redirect('./hello.html');
            res.send(result);
        })
    });
}


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
/*删除图片*/
function delPicture(req, res) {
    console.log(req.body);
    db.collection('picture').findById(req.body.del_pictureid, function (err, result) {
        var del_path = "public\\images\\" + result.realname;
        //if (!err) console.log(del_path);
        db.collection('picture').removeById(req.body.del_pictureid, function (err, result) {
            if (!err) {
                //console.log(req.body.id + ' deleted!');
                if (fs.existsSync(del_path)) {
                    fs.unlink(del_path, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        var query = {class:req.body.thisclass};
                        if(req.body.thisclass==''){
                            query = {};
                        }
                        db.collection('picture').find(query).toArray(function (err, result) {
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
/*修改图片分类*/
function updPicture(req, res) {
    /*console.log(req.query.upd_classid);
     console.log(req.query.upd_classname);*/
    db.collection('picture').updateById(req.query.upd_pictureid, {$set: {class: req.query.upd_classid}}, function (err, result) {
        if (err) throw err;
        if (!err) console.log('id:' + req.query.upd_pictureid + ' class:' + req.query.upd_classid + ' pictureUpdateClass!');
        res.send(req.query.upd_classid)
    });
}











/*picture*/
exports.creatPicture = creatPicture;
exports.classImg = classImg;
exports.showAllpicture = showAllpicture;
exports.updPicture = updPicture;
exports.delPicture = delPicture;
/*class*/





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








