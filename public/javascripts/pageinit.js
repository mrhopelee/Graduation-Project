/**
 * Created by Administrator on 2016-3-16.
 */


/*返回顶部初始化*/
function backtop(){
    $(function () {
        $(window).scroll(function () {
            if ($(this).scrollTop() != 0) {
                $("#toTop").fadeIn();
            } else {
                $("#toTop").fadeOut();
            }
        });
        $("body").append("<div id=\"toTop\" style=\"z-index: 100;border:1px solid #444;background:#333;color:#fff;text-align:center;padding:10px 13px 7px 13px;position:fixed;bottom:10px;right:10px;cursor:pointer;display:none;font-family:verdana;font-size:22px;\">^</div>");
        $("#toTop").click(function () {
            $("body,html").animate({scrollTop: 0}, 800);
        });
    });
};

/*图片按钮事件*/
function btninit(){
    var allbtndiv = $(".btndiv");
    var t;
    var temp = function () {
        t = setTimeout(function () {
            allbtndiv.css({"display": "none"});
        }, 500);
    }
    allbtndiv.mouseout(function (e) {
        e.preventDefault();
        temp();
    });
    allbtndiv.find("*").mouseover(function (e) {
        e.preventDefault();
        clearTimeout(t);
        allbtndiv.css({"display": "display"});

    });
    $('.showbtn').click(function (e) {
        e.preventDefault();

        var btndiv = $(this).next().next();
        if (btndiv.css("display") == "block") {

            btndiv.css({"display": "none"});
        } else if (btndiv.css("display") == "none") {
            allbtndiv.css({"display": "none"});
            btndiv.css({"display": "block"});
        }
    });
};




$(document).ready(function () {
    $("body").css("height", "2000px");
    backtop();/*返回顶部初始化*/
    btninit();/*图片按钮事件*/
    appendTC();
    tanchu(1, 1);
    getPicture();

    ClassInitFun();
});