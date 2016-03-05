/**
 * Created by Administrator on 2016-3-3.
 */
var str =  'mongodb://' + 'localhost' +':' + '27017'+ '/' + 'gp';
var db = require('mongoskin').db(str);
var imageinfo = require("./imageinfo");

function creatImg(req,res,data,classname) {
    var now= new Date();
    var info = imageinfo(data);
    db.collection('picture').insert({name: req.files[0].originalname,realname: req.files[0].originalname, date: [now.getYear(), now.getMonth(), now.getDate()], height: info.height, width: info.width, size: data.length, class: classname, tag: []}, function(err, result) {
        if (err) throw err;
        if (result) console.log('Added!');
    });
}
function showAllImg(req, res) {
    /*d*/

    //var classinfo = null;
    //var classnum = null;
    //classinfo = db.collection('class',{});
    //console.log(db.collection('class'));
    // console.log(db.collection('class').find());

    var INFO = {
        classinfo:null,
        setclassinfo:function(result) {
            this.classinfo=result;
        },
        getclassinfo:function() {
            return this.classinfo
        }
    }
        db.collection('class').find().toArray(function(err, result) {
            if (err) throw err;
            INFO.setclassinfo(result);
            //res.send(result);
        })
    console.log(INFO.getclassinfo());
    做到这做到这做到这
    /*for(var x=0; x < classinfo.length; x++) {
        db.collection('picture').count({class:classinfo[x].name}, function(err, count) {
            var temp = {"classinfo[x].name":count};
            classnum.push(temp);
            console.log('There are ' + classnum + ' bands in the database');
        });
    }*/

    db.collection('picture').find().toArray(function(err, result) {

        if (err) throw err;
        res.render('manager',{pi:result,ci:"123"});
        //res.send(result);
    })
}
function classImg(req,res,classname) {
    db.collection('picture').find(classname).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    })
}
function removeImg(req, res) {
    db.collection('picture').removeById(req.body.id, function(err, result) {
        if (!err) console.log(req.body.id+' deleted!');
    });
}


exports.removeImg     = removeImg;
exports.showAllImg = showAllImg;
exports.classImg    = classImg;
exports.creatImg    = creatImg;