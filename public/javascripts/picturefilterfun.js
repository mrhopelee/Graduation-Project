/**
 * Created by Administrator on 2016-4-6.
 */
function draw(resquery){
    var canvas = document.getElementById("canvas"),
        ctx = canvas.getContext("2d"),
        img = new Image(),
        tempImageData = null,
        imgData = null;



    var TCDiv=$('div.TCDiv');
    var tcdivh = TCDiv.height()*0.9,
        tcdivw = TCDiv.width()*0.9;

    if(resquery.height>=resquery.width){
        if(resquery.height<=tcdivh){
            setimgsize(resquery.height,resquery.width);
            //console.log("1");
        }else{
            setimgsize(tcdivh,resquery.width*tcdivh/resquery.height);
            console.log("2");
        }
    }else{
        if(resquery.width<=tcdivw){
            setimgsize(resquery.height,resquery.width);
            console.log("3");
        }else{
            setimgsize(resquery.height*tcdivw/resquery.width,tcdivw);
            console.log("4");
        }
    }
    function setimgsize(h,w){
        canvas.width = w;
        canvas.height = h;
        $('.TCimg ').css({
            "height": h,
            "width": w
        });
    }

    function getInitImageData(){
        ctx.drawImage(img , 0 , 0 , canvas.width , canvas.height);
        tempImageData = ctx.getImageData(0 , 0 , canvas.width , canvas.height); // 重新获取原始图像数据点信息
        imgData = tempImageData.data;
        console.log("GIID");
    }

    function resetImageData(){
        ctx.drawImage( img , 0 , 0 , canvas.width , canvas.height);
    }

    var canvasFilter = {
        invert : function(obj , i){
            obj[i] = 255 - obj[i];
            obj[i+1] = 255 - obj[i+1];
            obj[i+2] = 255 - obj[i+2];
        },
        grayscale : function(obj,i){
            var average = (obj[i] + obj[i+1] + obj[i+2]) / 3;
            //var average = 0.2126*obj[i] + 0.7152*obj[i+1] + 0.0722*obj[i+2]; 或者
            obj[i] = obj[i+1] = obj[i+2] = average;
        },
        sepia : function(obj , i){
            var r = obj[i],
                g = obj[i+1],
                b = obj[i+2];
            obj[i] = (r*0.393)+(g*0.769)+(b*0.189);
            obj[i+1] = (r*0.349)+(g*0.686)+(b*0.168);
            obj[i+2] = (r*0.272)+(g*0.534)+(b*0.131);
        },
        brightness : function(obj , i , brightVal){
            var r = obj[i],
                g = obj[i+1],
                b = obj[i+2];
            obj[i] += brightVal;
            obj[i+1] += brightVal;
            obj[i+2] += brightVal;
        },
        threshold : function(obj , i , thresholdVal){
            var average = (obj[i] + obj[i+1] + obj[i+2]) / 3;
            obj[i] = obj[i+1] = obj[i+2] = average > thresholdVal ? 255 : 0;
        },
        relief : function(obj , i , canvas){
            if ((i+1) % 4 !== 0) { // 每个像素点的第四个（0,1,2,3  4,5,6,7）是透明度。这里取消对透明度的处理
                if ((i+4) % (canvas.width*4) == 0) { // 每行最后一个点，特殊处理。因为它后面没有边界点，所以变通下，取它前一个点
                    obj[i] = obj[i-4];
                    obj[i+1] = obj[i-3];
                    obj[i+2] = obj[i-2];
                    obj[i+3] = obj[i-1];
                    i+=4;
                }
                else{ // 取下一个点和下一行的同列点
                    obj[i] = 255/2         // 平均值
                        + 2*obj[i]   // 当前像素点
                        - obj[i+4]   // 下一点
                        - obj[i+canvas.width*4]; // 下一行的同列点
                }
            }
            else {  // 最后一行，特殊处理
                if ((i+1) % 4 !== 0) {
                    obj[i] = obj[i-canvas.width*4];
                }
            }
        }
    }


    var reset = $("#reset"),
        invert = $("#invert"),
        grayscale = $("#grayscale"),
        sepia = $("#sepia"),
        brightness = $("#brightness"),
        threshold = $("#threshold"),
        blur = $("#blur"),
        relief = $("#relief"),
        save = $("#save"),
        saveserver = $('#saveserver');


    function allunbind(){
        $('.bgDiv button').unbind("click");
    }
    allunbind();

    reset.click(function(e){
        e.preventDefault();
        console.log("reset");
        resetImageData();
    });
    save.click(function(e){
        e.preventDefault();
        console.log("save");
        Canvas2Image.saveAsPNG(canvas);  // 这将会提示用户保存PNG图片
    });
    saveserver.click(function(e){
        e.preventDefault();
        //console.log(canvas.toDataURL("image/png"));
        $.ajax({
            url: "http://localhost:27017/savetemp",
            type: "POST",
            async: false,
            data: {
                "imgData": canvas.toDataURL("image/png")
            },
            success: function (result) {
                console.log(result);
                //picturePage(result);//取得数据操作返回的result，在页面重新生成图片
            }
        });
    });
    // 反相：取每个像素点与255的差值
    invert.click(function(e){
        e.preventDefault();
       getInitImageData();
        for(var i = 0 , len = imgData.length ; i < len ; i+=4){
            canvasFilter.invert(imgData , i);
        }
        ctx.putImageData( tempImageData , 0 , 0);
    });
    // 灰化：取某个点的rgb的平均值
    grayscale.click(function(e) {
        e.preventDefault();
        getInitImageData();
        for(var i = 0 , len = imgData.length ; i < len ; i+=4){
            canvasFilter.grayscale(imgData , i);
        }
        ctx.putImageData( tempImageData , 0 , 0);
    });
    // 怀旧：特定公式
    sepia.click(function(e) {
        e.preventDefault();
        getInitImageData();
        for(var i = 0 , len = imgData.length ; i < len ; i+=4){
            canvasFilter.sepia(imgData , i);
        }
        ctx.putImageData( tempImageData , 0 , 0);
    });
    // 变亮：rgb点加上某个数值
    brightness.click(function(e) {
        e.preventDefault();
        getInitImageData();
        for(var i = 0 , len = imgData.length ; i < len ; i+=4){
            canvasFilter.brightness(imgData , i , 30);
        }
        ctx.putImageData( tempImageData , 0 , 0);
    });
    // 阈值：将灰度值与设定的阈值比较，如果大于等于阈值，则将该点设置为255，否则设置为0
    //“阈值”命令将灰度或彩色图像转换为高对比度的黑白图像。您可以指定某个色阶作为阈值。所有比阈值亮的像素转换为白色；而所有比阈值暗的像素转换为黑色。“阈值”命令对确定图像的最亮和最暗区域很有用。
    threshold.click(function(e) {
        e.preventDefault();
        getInitImageData();
        for(var i = 0 , len = imgData.length ; i < len ; i+=4){
            canvasFilter.threshold(imgData , i , 150);
        }
        ctx.putImageData( tempImageData , 0 , 0);
    });
    // 模糊
    // stackblur
    blur.click(function(e) {
        e.preventDefault();
        getInitImageData();
        stackBlurCanvasRGBA( "canvas", 0, 0, canvas.width, canvas.height, 10 );
    });
    // 浮雕：取下一个点和下一行对应的点值
    relief.click(function(e) {
        e.preventDefault();
        getInitImageData();
        for(var i = 0 , len = imgData.length ; i < len ; i++){
            canvasFilter.relief(imgData , i , canvas);
        }
        ctx.putImageData( tempImageData , 0 , 0);
    });
    /*
     sepia.click(function(e) {
         e.preventDefault();
         getInitImageData();

         ctx.putImageData( tempImageData , 0 , 0);
     }
     */

    // init
    img.onload = function(){
        getInitImageData();
    };

    img.src = "filterimages\\" + resquery.resresult.realname;
    //img.crossOrigin = "Anonymous";

}
//draw();