/**
 * Created by mrhop on 2016/3/26 0026.
 */
/*取得数据操作返回的result，在页面重新生成图片*/
function picturePage(result) {
    $(".showpicture").empty();//清空图片节点
    for (var i = 0; i < result.length; i++) {
        createshowitem(".showpicture");//生成图片节点
        var j = i + 1;
        var nowshowitem = $(".showpicture>.showitem:nth-child(" + j + ")");
        /*console.log(nowshowitem);*/
        nowshowitem.attr({"data-id":result[i]._id});
        nowshowitem.find(".showimg>img").attr({
            "src": "images/" + result[i].realname,
            "alt": result[i].name
        });
        nowshowitem.find(".showname").html(result[i].name);
        if(i==result.length-1){
            //console.log("load clickfun");
            delpicturefun();//删除图片click事
            picturefilter();//图片滤镜
        }
    }
}
/*生成图片节点*/
function createshowitem(str) {
    var text = "<div class=\"showitem\" draggable=\"true\" ondragstart=\"drag(event)\">" +
        "<div class=\"showimg\">" +
        "<img draggable=\"false\">" +
        "</div>" +
        "<div class=\"showother abscenter\">" +
        "<div class=\"shownamediv\">" +
        "<span class=\"showname\"></span>" +
        "</div>" +
        "<div class=\"showbtns\">" +
        "<button class=\"picturefilter\">upd</button>" +
        "<button class=\"delpicture\">del</button>" +
        "</div>" +
        "</div>" +
        "</div>";
    $(str).append(text);
};
/*增加图片*/
function uploadFile(){
    var formData = new FormData($("#frmUploadFile")[0]);//获取图片上传form的formData
    /*console.log(formData);*/
    $.ajax({
        url: 'http://localhost:27017/file_upload',
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        success: function(result){
            picturePage(result);//取得数据操作返回的result，在页面重新生成图片
        }/*
         if(200 === data.code) {
         $("#imgShow").attr('src', data.msg.url);
         $("#spanMessage").html("上传成功");
         } else {
         $("#spanMessage").html("上传失败");
         }
         console.log('imgUploader upload success, data:', data);
         },
         error: function(){
         $("#spanMessage").html("与服务器通信发生错误");
         }*/
    });
}
/*删除图片click事件*/
function delpicturefun(){
    $('.delpicture').click(function(e){
        e.preventDefault();
        var thisbtn = $(this);
        var thispicture = thisbtn.parents('.showitem');//被点击的图片item
        var thisclass = $('.this');//当前分类
        //console.log(thispicture.attr('data-id'));
        $.ajax({
            url: "http://localhost:27017/delpicture",
            type: "POST",
            async: false,
            data: {
                "thisclass":  thisclass.attr('data-c'),
                "del_pictureid": thispicture.attr('data-id')
            },
            success: function (result) {
                picturePage(result);//取得数据操作返回的result，在页面重新生成图片
            }
        });
    });
}
/*图片滤镜click事件*/
function picturefilter(){
    $('.picturefilter').click(function(e){
        e.preventDefault();
        showTC();
        getfilterpicture();/*获取被点击的picture进入滤镜模式*/
    });
}
/*获取被点击的picture进入滤镜模式*/
function getfilterpicture(){
    var thisbtn = $('.showbtns button:hover');
    var thispicture = thisbtn.parents('.showitem');//被点击的图片item
    console.log(thispicture);
    if(thispicture.length== 0){ thispicture=$('#canvas');console.log(thispicture.attr('data-id'));}
        var thisclass = $('.this');//当前分类

        $('#canvas').attr({'data-id':thispicture.attr('data-id')});
        $.ajax({
            url: "http://localhost:27017/picturefilter",
            type: "POST",
            async: false,
            data: {
                "thisclass":  thisclass.attr('data-c'),
                "thispicture": thispicture.attr('data-id')
            },
            success: function (result) {
                //$('.TCimg').attr({"src":"filterimages\\" + result.realname});
                console.log(result)
                draw(result);
                /*------------------------------------做到这*/
                /*picturePage(result);*///取得数据操作返回的result，在页面重新生成图片
            }
        });

}
/*修改图片分类*/
function pictureUpd(query) {
    startUpdClass(query);//图片id：upd_pictureid  分类id：upd_classid
    function startUpdClass(query) {
        $.ajax({
            url: "http://localhost:27017/updpicture",
            async: false,
            data: {
                "upd_pictureid": query.pictureid,
                "upd_classid": query.newclassid
            },
            success: function (result) {

            }
        });
    }
}
/*查询分类，并在页面分类列表插入分类*/
function getPicture(query) {
    $.ajax({
        url: "http://localhost:27017/showallpicture",
        async: false,
        data: {"query":query},
        success: function (result) {
            picturePage(result);//取得数据操作返回的result，在页面重新生成图片
        }
    });
}

