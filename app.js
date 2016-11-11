// 配置文件 /usr/local/Cellar/tesseract/3.04.01_2/share/tessdata/configs

var fs        = require('fs');
var tesseract = require('node-tesseract');
var gm        = require('gm');
require('shelljs/global');

var arguments = process.argv;
var MAX_IMAGE_LENGTH = 20;

//训练文件也是训练经过gm处理之后的文件

if(arguments.indexOf('--tif') >=0){
     console.log('训练模式：生成训练用tif文件');
     //清除生成目录
     if (exec('rm -rf img_tesseract/*').code !== 0) {
          echo('Error: Delete failed');
          exit(1);
     }else{
        console.log('清空目录 img_tesseract')
     }
    //便利目录生成tif格式 用于训练，不识别
    (function start(i){
        if(i <= MAX_IMAGE_LENGTH){
            processImg(`img_src/code-${i}.png`,`img_tesseract/code-${ i }.tif`, arguments[2]|| 30 )
            .then(text => {
              return new Promise((resolve, reject) => {
                    console.log(`转tif:  图${i}`)
                    resolve(++i)
                });
            })
            .then(start) 
        }
    })(1);
}
else{

    //清除生成目录
     if (exec('rm -rf img_dist/*').code !== 0) {
          echo('Error: Delete failed');
          exit(1);
     }else{
        console.log('清空目录 mg_dist');
     }

    //便利目录生成png格式图，用于识别
    (function start(i){
        if(i <= MAX_IMAGE_LENGTH){
              processImg(`img_src/code-${i}.png`,`img_dist/code-${ i }.png`, arguments[2]|| 30 )
                .then(recognizer)
                .then(text => {
                  return new Promise((resolve, reject) => {
                         console.log(`【${i}】识别结果:${text}`);
                         resolve(++i)
                    });
                })
                .then(start) 
                // .catch((err)=> {
                //     console.error(`【${i}】识别失败:${err}`);
                // });
        }
    })(1);

}


// cd('src');
// for(var i = 0; i< 10; i++){
//     if (exec('wget https://supplier.rt-mart.com.cn/code.php --no-check-certificate').code !== 0) {
//       echo('Error: Download failed');
//       exit(1);
//     }
// }



/**
 * 处理图片为阈值图片 **** 如何优化图片提高识别率 可以根据验证码不同而优化
 * 在这一些验证码中 字体的颜色是固定的所以提取出来做二值化处理

 * @param imgPath
 * @param newPath
 * @param [thresholdVal=55] 默认阈值
 * @returns {Promise}
 */
function processImg (imgPath, newPath, thresholdVal) {
    return new Promise((resolve, reject) => {
        gm(imgPath)
            .transparent('#444444FF')
            .fuzz(100)
            .scale(500)
            .whiteThreshold(0,0,0,0)
            .write(newPath, (err)=> {
                if (err) return reject(err);

                resolve(newPath);
            });
    });
}

/**
 * 识别图片
 * @param imgPath
 * @param options tesseract options
 * @returns {Promise}
 */
function recognizer (imgPath, options) {

    options = Object.assign({psm: 7, l: 'yuk'}, options);
    return new Promise((resolve, reject) => {
        tesseract
            .process(imgPath, options, (err, text) => {
                if (err) return reject(err);
                resolve(text.replace(/[\r\n\s]/gm, ''));
            });
    });
}