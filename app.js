// 配置文件 /usr/local/Cellar/tesseract/3.04.01_2/share/tessdata/configs

var fs        = require('fs');
var tesseract = require('node-tesseract');
var gm        = require('gm');
var co = require('co');

var log = require('./log');
var processImage = require('./processImage');

require('shelljs/global');

var arguments = process.argv;
var MAX_IMAGE_LENGTH = 100;

//训练文件也是训练经过gm处理之后的文件

if(arguments.indexOf('--tif') >=0){
     console.log('训练模式：生成训练用tif文件');
     //清除生成目录
     // if (exec('rm -rf img_tesseract/*').code !== 0) {
     //      echo('Error: Delete failed');
     //      exit(1);
     // }else{
     //    console.log('清空目录 img_tesseract')
     // }
    //便利目录生成tif格式 用于训练，不识别

       // co.wrap(function* () {
       //    yield processImg('img_tesseract_letter/1.jpg', 'img_tesseract/letter_1.tif');
       //    yield processImg('img_tesseract_letter/2.jpg', 'img_tesseract/letter_2.tif');
       //    yield processImg('img_tesseract_letter/3.jpg', 'img_tesseract/letter_3.tif');
       // })();
    
    

    (function start(i){
        if(i <= MAX_IMAGE_LENGTH){
            processImg(`img_dist/img_${i}.png`,`img_tesseract/img_${ i }.tif`, arguments[2]|| 30 )
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
        console.log('清空目录 img_dist');
     }

    //便利目录生成png格式图，用于识别
   
    co.wrap(function* () {
      for(var i = 0; i< MAX_IMAGE_LENGTH; i++){
 
        // var url =yield processImg(`img_src/img_${i}.jpg`,`img_dist/img_${ i }.png`, process.argv[2] || 20);
        //         .then(recognizer)
        //         .then(text => {
        //           return new Promise((resolve, reject) => {
        //                  console.log(`【${i}】识别结果:${text}`);
        //                  resolve()
        //             });
        //         }).catch(e=>{
        //           console.log(e)
        //         })

                processImage(i);

                // yield recognizer(`img_dist/img_${ i }.png`).then(text => {
                //   return new Promise((resolve, reject) => {
                //          console.log(`【${i}】识别结果:${text}`);
                //          resolve()
                //     });
                // }).catch(e=>{
                //   console.log(e)
                // })
      }
    })();
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
            // .transparent('#444444FF')
            // .fuzz(100)
            // .scale(500)
            // .whiteThreshold(250,250,250,100)
            // .normalize()
            // .threshold( thresholdVal + '%')
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

    options = Object.assign({psm: 7, l:'apple'}, options);
    return new Promise((resolve, reject) => {
        tesseract
            .process(imgPath, options, (err, text) => {
                if (err) return reject(err);
                resolve(text.replace(/[\r\n\s]/gm, ''));
            });
    });
}