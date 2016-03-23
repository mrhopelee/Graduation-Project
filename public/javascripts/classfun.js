/**
 * Created by Administrator on 2016-3-16.
 */
/*分类时间初始化*/
function ClassInitFun(){
    getClassName();/*获取分类*/
    classClick();/*点击分类列表*/
    newClassClick();/*新增分类的页面交互时间*/
    classCre();/*新增分类事件*/
}

/*查询分类，并在页面分类列表插入分类*/
function getClassName(){
    $.ajax({
        url: "http://localhost:27017/findclassname",
        async: false,
        data: {},
        success: function (result) {
            var lasttclass = null;
            var classText = "";
            for (var i = 0; i < result.length; i++) {
                lasttclass = $(".classlist>li:last-child");
                classText = "<li data-c=\""+result[i]._id+"\" data-n=\""+result[i].name+"\" class=\"classitem\">"+result[i].name+"</li>";
                lasttclass.after(classText);
            }
        }
    });
}

/*清空列表项中的无关元素*/
function cleanClassUD(){
    $(".hiduc").remove();
    $(".delclass").remove();
    $(".updclass").remove();
    $('.this').removeClass("this");
}
/*生成图片节点*/
function createshowitem(str) {
    var text = "<div class=\"showitem btcf\"><div class=\"showimg\"><img src=\"\" alt=\"\"></div><div class=\"showother\"><button class=\"showbtn\">···</button><div class=\"shownamediv\"><span class=\"showname\"></span></div><div class=\"btndiv\"><button class=\"editbtn\">update</button><form action=\"/image_del\" method=\"post\" class=\"delform\"><input type=\"hidden\" value=\"\" name=\"id\"><button type=\"submit\" value=\"delete\">delete</button></form></div></div></div>";
    $(str).append(text);
};
/*点击分类列表*/
function classClick(){
    $('.classitem').click(function (e) {
        e.preventDefault();
        /*被选中的class改变样式*/
        /*通过比较.this和被点击的this列表项的"data-c",判断是否点击重复*/
        if ($('.this').attr("data-c") == $(this).attr("data-c")) {
            /*console.log($('.this').attr("data-c"));
            console.log($(this).attr("data-c"));*/
        } else if(($(this).attr("data-c")=="56dab2879a78ca71f18afdb6")||($(this).attr("data-c")=="")) {
            cleanClassUD();

            $(this).addClass("this");
        } else {
            /*console.log($('.this').attr("data-c"));
            console.log($(this).attr("data-c"));*/
            cleanClassUD();
            var classnamestr = $(this).text();
            $(this)
                .addClass("this")
                .append("<button class=\"updclass\">u</button><button class=\"delclass\">d</button>")
                .append("<div class=\"hiduc\"><input class=\"udpclassname\" type=\"text\" /><button class=\"udpclassbtn\">修改</button><button class=\"hidudpclassbtn\">取消</button></div>");
            $('.udpclassname').val(classnamestr);

            classDel();/*删除分类事件*/
            updateClassClick();/*修改分类的页面交互*/
        }
        /*点击class后触发分类查询*/
        var thisc = $(this).attr("data-c");
        $(".uploaddiv input[type=\"hidden\"]").attr("value", thisc);
        /*console.log(thisc);*/
        $.ajax({
            url: "http://localhost:27017/classimage",
            async: false,
            data: {"thisclassid": thisc},
            success: function (result) {
                $(".showbox").empty();/*清空图片节点*/

                for (var i = 0; i < result.length; i++) {
                    createshowitem(".showbox");/*生成图片节点*/
                    var j = i + 1;
                    var nowshowitem = $(".showbox>.showitem:nth-child(" + j + ")");
                    nowshowitem.find(".showimg>img").attr({
                        "src": "images/" + result[i].realname,
                        "alt": result[i].name
                    });
                    nowshowitem.find(".showname").html(result[i].name);
                    nowshowitem.find(".delform>input:first-child").attr({"value": result[i]._id});
                }
            }
        });
        btninit();/*图片按钮事件，不能去掉*/
        tanchu(1, 1);/*弹出层事件，不能去掉*/
    });
}
/*删除分类事件*/
function classDel(){
    $('.delclass').click(function (e) {
        e.preventDefault();
        var thisclass = $(this).parent();
        $.ajax({
            url: "http://localhost:27017/delclass",
            async: false,
            data: {"classid": thisclass.attr("data-c")},
            success: function (result) {
                $(".classlist>li:not(:first-child)").remove();
                var lasttclass = null;
                var classText = "";
                for (var i = 0; i < result.length; i++) {
                    lasttclass = $(".classlist>li:last-child");
                    classText = "<li data-c=\""+result[i]._id+"\" data-n=\""+result[i].name+"\" class=\"classitem\">"+result[i].name+"</li>";
                    lasttclass.after(classText);
                }
                classClick();
            }
        });
    });
}
/*修改分类事件*/
function classUpd(){
    $('.udpclassbtn').click(function (e) {
        e.preventDefault();
        var thisclass = $('.classitem.this');
        var upd_classname = $('.udpclassname').val();
        var upd_classid = thisclass.attr("data-c");
        console.log(upd_classname);
        console.log(upd_classid);
        $.ajax({
            url: "http://localhost:27017/updclass",
            async: false,
            data: {
                "upd_classid": upd_classid,
                "upd_classname": upd_classname
            },
            success: function (result) {
                $(".classlist>li:not(:first-child)").remove();
                var lasttclass = null;
                var classText = "";
                for (var i = 0; i < result.length; i++) {
                    lasttclass = $(".classlist>li:last-child");
                    classText = "<li data-c=\""+result[i]._id+"\" data-n=\""+result[i].name+"\" class=\"classitem\">"+result[i].name+"</li>";
                    lasttclass.after(classText);
                }
                classClick();
            }
        });
    });
}
/*修改分类的页面交互*/
function updateClassClick(){
    $('.updclass').click(function (e) {
        e.preventDefault();
        $('.hiduc').css({
            "display":"inline-block"
        });
    });
    $('.hiduc>button').click(function (e) {
        e.preventDefault();
        $('.hiduc').css({
            "display":"none"
        });
    });
    classUpd();
}


/*新增分类事件*/
function classCre(){
    $(".creclassbtn").click(function(e){
        e.preventDefault();


        var newclassname = $(".creclassname").val();
        /*console.log(newclassname);*/
        $.ajax({
            url: "http://localhost:27017/creclass",
            async: false,
            data: {"newclassname": newclassname},
            success: function (result) {
                $(".classlist>li:not(:first-child)").remove();
                var lasttclass = null;
                var classText = "";
                for (var i = 0; i < result.length; i++) {
                    lasttclass = $(".classlist>li:last-child");
                    classText = "<li data-c=\""+result[i]._id+"\" data-n=\""+result[i].name+"\" class=\"classitem\">"+result[i].name+"</li>";
                    lasttclass.after(classText);
                }
                classClick();
            }
        });
    })
}
/*新增分类的页面交互*/
function newClassClick(){
    $('.newclassbtn').click(function (e) {
        e.preventDefault();
        $('.hidnewclass').css({
            "display":"block"
        });
    });
    $('.creclassname~button').click(function (e) {
        e.preventDefault();
        $('.hidnewclass').css({
            "display":"none"
        });
    });
}