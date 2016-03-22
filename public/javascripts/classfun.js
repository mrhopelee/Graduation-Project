/**
 * Created by Administrator on 2016-3-16.
 */


function createshowitem(str) {
    var text = "<div class=\"showitem btcf\"><div class=\"showimg\"><img src=\"\" alt=\"\"></div><div class=\"showother\"><button class=\"showbtn\">···</button><div class=\"shownamediv\"><span class=\"showname\"></span></div><div class=\"btndiv\"><button class=\"editbtn\">update</button><form action=\"/image_del\" method=\"post\" class=\"delform\"><input type=\"hidden\" value=\"\" name=\"id\"><button type=\"submit\" value=\"delete\">delete</button></form></div></div></div>";
    $(str).append(text);
};

function classClick(){
    $('.classbtn').click(function (e) {
        e.preventDefault();
        $('.hidnc').css({
            "display":"block"
        });
    });
    $('.newclassname~button').click(function (e) {
        e.preventDefault();
        $('.hidnc').css({
            "display":"none"
        });
    });

    $('.classitem').click(function (e) {
        e.preventDefault();

        /*被选中的class改变样式*/
        if ($('.this').attr("data-c") == $(this).attr("data-c")) {
            /*console.log($('.this').attr("data-c"));
            console.log($(this).attr("data-c"));*/
        } else if(($(this).attr("data-c")=="56dab2879a78ca71f18afdb6")||($(this).attr("data-c")=="")) {
            $(".delclass").remove();
            $(".updclass").remove();
            $('.this').removeClass("this");
            $(this).addClass("this");
        } else {
            /*console.log($('.this').attr("data-c"));
            console.log($(this).attr("data-c"));*/
            $(".delclass").remove();
            $(".updclass").remove();
            $('.this').removeClass("this");
            $(this)
                .addClass("this")
                .append("<button class=\"updclass\">u</button><button class=\"delclass\">d</button>")
                .append("<div class=\"hiduc\"><input class=\"udpclassname\" type=\"text\"></input><button class=\"udpclassbtn\">修改</button><button class=\"hidudpclassbtn\">取消</button></div>");
            $('.hiduc>button').click(function (e) {
                e.preventDefault();
                console.log("123");
                $('.hiduc').css({
                    "display":"none"
                });
            });
            classDel();
            classUpd();
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
                $(".showbox").empty();

                for (var i = 0; i < result.length; i++) {
                    createshowitem(".showbox");
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
        btninit();
        tanchu(1, 1);
    });

}

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

function classCre(){
    $(".newclassbtn").click(function(e){
        e.preventDefault();
        var newclassname = $(".newclassname").val();
        console.log(newclassname);
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
function classUpd(){
    $('.updclass').click(function (e) {
        e.preventDefault();
        var thisclass = $(this).parent();
        $('.hiduc').css({
            "display":"inline-block"
        });
        /*$.ajax({
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
        });*/
    });
}
