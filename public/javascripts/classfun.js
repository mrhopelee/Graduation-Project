/**
 * Created by Administrator on 2016-3-16.
 */


function createshowitem(str) {
    var text = "<div class=\"showitem btcf\"><div class=\"showimg\"><img src=\"\" alt=\"\"></div><div class=\"showother\"><button class=\"showbtn\">···</button><div class=\"shownamediv\"><span class=\"showname\"></span></div><div class=\"btndiv\"><button class=\"editbtn\">update</button><form action=\"/image_del\" method=\"post\" class=\"delform\"><input type=\"hidden\" value=\"\" name=\"id\"><button type=\"submit\" value=\"delete\">delete</button></form></div></div></div>";
    $(str).append(text);
};

function classClick(){

    $('.classitem').click(function (e) {
        e.preventDefault();

        /*被选中的class改变样式*/
        if ($('.this').attr("data-c") == $(this).attr("data-c")) {
            console.log($('.this').attr("data-c"));
            console.log($(this).attr("data-c"));
        } else {
            console.log($('.this').attr("data-c"));
            console.log($(this).attr("data-c"));
            $('.this').removeClass("this");
            $(this).addClass("this");
        }

        /*点击class后触发分类查询*/
        var thisc = $(this).attr("data-c");
        $(".uploaddiv input[type=\"hidden\"]").attr("value", thisc);
        $.ajax({
            url: "http://localhost:27017/classimage",
            async: false,
            data: {"classname": thisc},
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
                classText = "<li data-c=\""+result[i].name+"\" class=\"classitem\">"+result[i].name+"</li>";
                lasttclass.after(classText);
            }
        }
    });
}

function classNew(){
    $(".classbtn").click(function(e){
        e.preventDefault();
        var newclassname = $("");
        $.ajax({
            url: "http://localhost:27017/newclass",
            async: false,
            data: {"newclass": newclassname},
            success: function (result) {

            }
        });
    })
}
