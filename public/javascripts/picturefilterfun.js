/**
 * Created by Administrator on 2016-4-6.
 */
function draw(resquery) {
    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        img = new Image(),
        tempImageData = null,
        imgData = null;


    var TCDiv = $('div.TCDiv');
    var tcdivh = TCDiv.height() * 0.9,
        tcdivw = TCDiv.width() * 0.9,
        imgh = 0,
        imgw = 0,
        centerh = 0,
        centerw = 0,
        radin = Math.PI*2;

    if (resquery.height >= resquery.width) {
        if (resquery.height <= tcdivh) {
            /*imgh = resquery.height;
            imgw = resquery.width;*/
            setimgsize(resquery.height,resquery.width);
            //console.log("1");
        } else {
            /*imgh = tcdivh * 0.9;
            imgw = resquery.width * tcdivh * 0.9 / resquery.height;*/
            setimgsize(tcdivh,resquery.width*tcdivh/resquery.height);
            //console.log("2");
        }
    } else {
        if (resquery.width <= tcdivw) {
            /*imgh = resquery.height;
            imgw = resquery.width;*/
            setimgsize(resquery.height,resquery.width);
            //console.log("3");
        } else {
            /*imgh = resquery.height * tcdivw * 0.9 / resquery.width;
            imgw = tcdivw * 0.9;*/
            setimgsize(resquery.height*tcdivw/resquery.width,tcdivw);
            //console.log("4");
        }
    }
    //setimgsize(tcdivh, tcdivw);
    function setimgsize(h, w) {
        imgh=canvas.height = h;
        imgw=canvas.width = w;
        $('.TCimg ').css({
            "height": h,
            "width": w
        });
        /*centerh = (h - imgh) / 2;
        centerw = (w - imgw) / 2
        console.log(centerw, centerh, centerw + imgw, centerh + imgh);*/
    }

    function getInitImageData() {
        //ctx.clearRect( 0, 0, TCDiv.width(), TCDiv.height() );
        //ctx.drawImage(img, centerw, centerh, imgw, imgh);
        //tempImageData = ctx.getImageData(centerw, centerh, imgw, imgh); // 重新获取原始图像数据点信息
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        tempImageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // 重新获取原始图像数据点信息
        imgData = tempImageData.data;
        //console.log("getInitImageData");
    }

    function resetImageData() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }





    var canvasFilter = {
        // 反相：取每个像素点与255的差值
        invert: function (obj, i) {
            obj[i] = 255 - obj[i];
            obj[i + 1] = 255 - obj[i + 1];
            obj[i + 2] = 255 - obj[i + 2];
        },
        // 灰化：取某个点的rgb的平均值
        grayscale: function (obj, i) {
            var average = (obj[i] + obj[i + 1] + obj[i + 2]) / 3;
            //var average = 0.2126*obj[i] + 0.7152*obj[i+1] + 0.0722*obj[i+2]; 或者
            obj[i] = obj[i + 1] = obj[i + 2] = average;
        },
        // 怀旧：特定公式
        sepia: function (obj, i) {
            var r = obj[i],
                g = obj[i + 1],
                b = obj[i + 2];
            obj[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
            obj[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            obj[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
        },
        // 浮雕：取下一个点和下一行对应的点值
        relief: function (obj, i, imgw) {
            if ((i + 1) % 4 !== 0) { // 每个像素点的第四个（0,1,2,3  4,5,6,7）是透明度。这里取消对透明度的处理
                if ((i + 4) % (imgw * 4) == 0) { // 每行最后一个点，特殊处理。因为它后面没有边界点，所以变通下，取它前一个点
                    obj[i] = obj[i - 4];
                    obj[i + 1] = obj[i - 3];
                    obj[i + 2] = obj[i - 2];
                    obj[i + 3] = obj[i - 1];
                    i += 4;
                }
                else { // 取下一个点和下一行的同列点
                    obj[i] = 255 / 2         // 平均值
                        + 2 * obj[i]   // 当前像素点
                        - obj[i + 4]   // 下一点
                        - obj[i + imgw * 4]; // 下一行的同列点
                }
            }
            else {  // 最后一行，特殊处理
                if ((i + 1) % 4 !== 0) {
                    obj[i] = obj[i - imgw * 4];
                }
            }
        },
        // 变亮：rgb点加上某个数值
        brightness: function (obj, i, brightVal) {
            var r = obj[i],
                g = obj[i + 1],
                b = obj[i + 2];
            obj[i] += brightVal;
            obj[i + 1] += brightVal;
            obj[i + 2] += brightVal;
        },
        // 阈值：将灰度值与设定的阈值比较，如果大于等于阈值，则将该点设置为255，否则设置为0
        //“阈值”命令将灰度或彩色图像转换为高对比度的黑白图像。您可以指定某个色阶作为阈值。所有比阈值亮的像素转换为白色；而所有比阈值暗的像素转换为黑色。“阈值”命令对确定图像的最亮和最暗区域很有用。
        threshold: function (obj, i, thresholdVal) {
            var average = (obj[i] + obj[i + 1] + obj[i + 2]) / 3;
            obj[i] = obj[i + 1] = obj[i + 2] = average > thresholdVal ? 255 : 0;
        }
    }


    var reset = $("#reset"),
        invert = $("#invert"),
        grayscale = $("#grayscale"),
        sepia = $("#sepia"),
        relief = $("#relief"),
        brightness = $("#brightness"),
        threshold = $("#threshold"),
        blur = $("#blur"),
        save = $("#save"),
    //savetemp = $('#savetemp'),
        savegallery = $('#savegallery'),
        ssz = $('#ssz');



    function allunbind() {
        $('.bgDiv button').unbind("click");
    }

    allunbind();

    reset.click(function (e) {
        e.preventDefault();
        allfilter($(this));
        console.log("reset");
        console.log("reset");
        getInitImageData();
        resetImageData();
        $('#canvas').attr({'data-f': ''});
    });
    save.click(function (e) {
        e.preventDefault();
        console.log("save");
        Canvas2Image.saveAsPNG(canvas);  // 这将会提示用户保存PNG图片
    });
    /*/!*保存图片到临时文件*!/
     savetemp.click(function(e){
     e.preventDefault();
     //console.log(canvas.toDataURL("image/png"));
     $.ajax({
     url: "http://localhost:27017/savetemp",
     type: "POST",
     async: false,
     data: {
     "imgData": canvas.toDataURL("image/png"),
     "imageName_body":  $('#canvas').attr('data-rn'),
     "imageName_head":  $('#canvas').attr('data-f')
     },
     success: function (result) {
     if(result.exists){

     }else {
     var li = "<li><img src='" + result.url + "'></li>";
     $('#temppiclist').append(li);
     if(result.imageinfo.height >= result.imageinfo.width){
     $('.temppiclist img').css({
     "width":"80px",
     "height":"auto"
     });
     }else{
     $('.temppiclist img').css({
     "width":"auto",
     "height":"80px"
     });
     }
     console.log(result);
     //picturePage(result);//取得数据操作返回的result，在页面重新生成图片
     }

     }
     });
     });*/
    /*保存图片到相册*/
    savegallery.click(function (e) {
        e.preventDefault();
        //console.log(canvas.toDataURL("image/png"));

        if ($('#canvas').attr('data-f') === '') {

        } else {
            $.ajax({
                url: "http://localhost:27017/savegallery",
                type: "POST",
                async: false,
                data: {
                    "imgData": canvas.toDataURL("image/png"),
                    "imageName_body": $('#canvas').attr('data-rn'),
                    "imageName_head": $('#canvas').attr('data-f')
                },
                success: function (result) {
                    alert(result);
                }
            });
        }

    });
    // 反相：取每个像素点与255的差值
    invert.click(function (e) {
        e.preventDefault();
        allfilter($(this));
        getInitImageData();//
        for (var i = 0, len = imgData.length; i < len; i += 4) {
            canvasFilter.invert(imgData, i);
        }
        ctx.putImageData(tempImageData, 0, 0);
        $('#canvas').attr({'data-f': 'invert'});
    });
    // 灰化：取某个点的rgb的平均值
    grayscale.click(function (e) {
        e.preventDefault();
        allfilter($(this));
        getInitImageData();//
        for (var i = 0, len = imgData.length; i < len; i += 4) {
            canvasFilter.grayscale(imgData, i);
        }
        ctx.putImageData(tempImageData, 0, 0);
        $('#canvas').attr({'data-f': 'grayscale'});
    });
    // 怀旧：特定公式
    sepia.click(function (e) {
        e.preventDefault();
        allfilter($(this));
        getInitImageData();//
        for (var i = 0, len = imgData.length; i < len; i += 4) {
            canvasFilter.sepia(imgData, i);
        }
        ctx.putImageData(tempImageData, 0, 0);
        $('#canvas').attr({'data-f': 'sepia'});
    });
    // 浮雕：取下一个点和下一行对应的点值
    relief.click(function (e) {
        e.preventDefault();
        allfilter($(this));
        getInitImageData();//
        for (var i = 0, len = imgData.length; i < len; i++) {
            canvasFilter.relief(imgData, i, canvas.width);
        }
        ctx.putImageData(tempImageData, 0, 0);
        $('#canvas').attr({'data-f': 'relief'});
    });
    // 变亮：rgb点加上某个数值
    brightness.click(function (e) {
        e.preventDefault();
        allfilter($(this));
        getInitImageData();//
        for (var i = 0, len = imgData.length; i < len; i += 4) {
            canvasFilter.brightness(imgData, i, 80);
        }
        ctx.putImageData(tempImageData, 0, 0);
        $('#canvas').attr({'data-f': 'brightness'});
        $('.smallvalue').css({"left": ($('.bigvalue').width() - $('.smallvalue').width()) * 0.70});
        $('.filtername').text('亮度 : ');
        $('.filtervalue').text('70%');
        $('.smallvalue').attr({"data-f": "brightness"});
    });
    // 阈值：将灰度值与设定的阈值比较，如果大于等于阈值，则将该点设置为255，否则设置为0
    //“阈值”命令将灰度或彩色图像转换为高对比度的黑白图像。您可以指定某个色阶作为阈值。所有比阈值亮的像素转换为白色；而所有比阈值暗的像素转换为黑色。“阈值”命令对确定图像的最亮和最暗区域很有用。
    threshold.click(function (e) {
        e.preventDefault();
        allfilter($(this));
        getInitImageData();//
        for (var i = 0, len = imgData.length; i < len; i += 4) {
            canvasFilter.threshold(imgData, i, 153);
        }
        ctx.putImageData(tempImageData, 0, 0);
        $('#canvas').attr({'data-f': 'threshold'});
        $('.smallvalue').css({"left": ($('.bigvalue').width() - $('.smallvalue').width()) * 0.6});
        $('.filtername').text('阈值 : ');
        $('.filtervalue').text('60%');
        $('.smallvalue').attr({"data-f": "threshold"});
    });
    // 模糊
    // stackblur
    blur.click(function (e) {
        e.preventDefault();
        allfilter($(this));
        getInitImageData();//
        //stackBlurImage( "testing", "canvas", 10, true );
        stackBlurCanvasRGBA("canvas", 0, 0, canvas.width, canvas.height, 10);
        $('#canvas').attr({'data-f': 'blur'});
        $('.smallvalue').css({"left": ($('.bigvalue').width() - $('.smallvalue').width()) * 0.1});
        $('.filtername').text('模糊 : ');
        $('.filtervalue').text('10%');
        $('.smallvalue').attr({"data-f": "blur"});
    });
    //顺时针ssz
    ssz.click(function (e) {
        e.preventDefault();

        imgh=imgh+imgw;
        imgw=imgh-imgw;
        imgh=imgh-imgw;
        $('#canvas').attr({"data-f": "ssz"}).css({
            "height":imgh,
            "width":imgw
        });
        radin += Math.PI/2;
        ctx.save();
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        //ctx.translate( 0 , 0 );

        if((radin/(Math.PI/2))%2==1){
            ctx.translate(canvas.height/2 , canvas.width/2 );
            ctx.scale( 1, 1 );
            ctx.rotate(radin);
            ctx.drawImage( img, -imgw/2, -imgh/2 );
        }else{
            ctx.translate(canvas.width/2, canvas.height/2 );
            ctx.scale( 1, 1 );
            if(radin===Math.PI*4)
            {radin = Math.PI*2;}
            ctx.rotate(radin);
            ctx.drawImage( img, -imgw/2, -imgh/2 );
        }

        ctx.restore();

        //ctx.putImageData(tempImageData, 0, 0);
    })




    $('.smallvalue').mousedown(function () {
        //console.log($('.bigvalue').offset().left);
        if ($('.smallvalue').attr('data-f') === "") {
            $('.filtervalue').text("未选择滤镜");
        } else {
            //$('.smallvalue').text("拖");

            $('body').on('mousemove', function (event) {
                smallmove();
                $('body').on('mouseup', function () {
                    //$('.smallvalue').text("放");
                    $('body').off('mousemove');
                    $('body').off('mouseup');
                });
            });
        }

    });

    $('.bigvalue').mousedown(function (event) {
        if ($('.smallvalue').attr('data-f') === "") {
            $('.filtervalue').text("未选择滤镜");
        } else {
            $('.smallvalue').text("");
            smallmove();
        }
    });

    function smallmove() {
        var smallv = $('.smallvalue'),
            bigv = $('.bigvalue');
        var smallLeft = event.pageX - bigv.offset().left - smallv.width() / 2,
            bigwidth = bigv.width() - smallv.width();
        if (smallLeft > bigwidth) {
            smallLeft = bigwidth;
        }
        if (smallLeft < 0) {
            smallLeft = 0;
        }
        var sb = (smallLeft * 100 / bigwidth).toFixed(0);
        smallv.css({
            "left": smallLeft
        });
        $('.filtervalue').text(sb + '%');
        //console.log("b",sb);
        if (smallv.attr('data-f') === "brightness") {
            console.log("b", sb);
            getInitImageData();//
            for (var i = 0, len = imgData.length; i < len; i += 4) {
                canvasFilter.brightness(imgData, i, (sb - 50) * 4);
            }
            ctx.putImageData(tempImageData, 0, 0);
        }
        if (smallv.attr('data-f') === "threshold") {
            getInitImageData();//
            for (var i = 0, len = imgData.length; i < len; i += 4) {
                canvasFilter.threshold(imgData, i, 153 + (sb - 60) * 2.55);
            }
            ctx.putImageData(tempImageData, 0, 0);
        }
        if (smallv.attr('data-f') === "blur") {
            getInitImageData();//
            stackBlurCanvasRGBA("canvas", 0, 0, canvas.width, canvas.height, sb);

        }
    }


    function allfilter(e) {
        //e.preventDefault();
        $('.thisfilter').removeClass('thisfilter');
        $(e).addClass('thisfilter');
    };

    // init
    img.onload = function () {
        getInitImageData();
    };

    img.src = "filterimages\\" + resquery.resresult.realname;
    //img.crossOrigin = "Anonymous";

}
//draw();