/* global define, $*/
(function(){
    var MAX_WIDTH = 640,
        MAX_HEIGHT = 640;

    var _uploading = function(text){
        $(document.body).addClass('uploading');
    };

    var _uploaded = function(){
        $(document.body).removeClass('uploading');
    };

    var ScaleImageHelper = {

        //从FILE中加载img
        loadImageFromFile : function(file, callback) {
            var reader = new FileReader();
            reader.onload = function (e) {
                callback(e.target.result);
            };
            reader.readAsDataURL(file);
        },
     
        dataURItoBlob : function(dataURI){
            var byteString = atob(dataURI.split(',')[1]);
            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
     
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            try{
                return new Blob([ia], {type:mimeString});
            }catch(e){
                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;
                var bb = new BlobBuilder();
                bb.append(ab);
                return bb.getBlob(mimeString);
            }
        },
     
        resizeImgToCanvas : function(img, maxWidth, maxHeight){
            maxWidth = maxWidth||MAX_WIDTH;
            maxHeight = maxHeight||MAX_HEIGHT;
            var width = img.width;
            var height = img.height;
     
            if(width > height){
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            }else{
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }
            console.log(width+'_'+height);
            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            return canvas;
        },

        canvasToDataURL : function(canvas, quality){
            quality = quality || 0.6;
            return canvas.toDataURL('image/jpeg', quality);
        },
     
        canvasToBlob : function(canvas, quality){
            var dataURL = this.canvasToDataURL(canvas, quality);
            return this.dataURItoBlob(dataURL);
        },
     
        postWidthMedia : function(options){
            var _default = {
                type:'POST',
                contentType:false,
                processData:false,
                dataType : 'json',
                complete : function(){
                    _uploaded();
                }
            };

            options = $.extend(_default, options);

            _uploading();
            return $.ajax(options);
        }
    };

    //上传图像
    $.fn.uploadPicture = function(options){
        $(this).on('change', function(){
            var self = this;
            if(self.files.length<1){
                return ;
            }
            var file = self.files[0];

            ScaleImageHelper.loadImageFromFile(file, function(src){
                var img = document.createElement('img');
                img.onload = function(){
                    //通过canvas缩放图片
                    var canvas = ScaleImageHelper.resizeImgToCanvas(this, options.maxWidth || MAX_WIDTH, options.maxHeight || MAX_HEIGHT);
                    //把canvas转成blob格式
                    var dataURL = ScaleImageHelper.canvasToDataURL(canvas);

                    options.data = new FormData();
                    options.data.append(options.filename || 'filename', file.name);
                    options.data.append(options.filetype || 'filetype', file.type);
                    options.data.append(options.name || 'files', dataURL);
                    ScaleImageHelper.postWidthMedia(options);
                };
                img.src = src;
                self.value = '';
            });
        });

        return ScaleImageHelper;
    };
}());
