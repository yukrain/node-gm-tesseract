var Canvas = require('canvas');
var	Image = Canvas.Image;
var	Font = Canvas.Font;
var	fs = require('fs');
var	path = require('path');
var log = require('./log');

const WIDTH = 160;
const HEIGHT = 70;

var canvas1 = new Canvas(WIDTH, HEIGHT);
var ctx1 = canvas1.getContext('2d');

var canvas2 = new Canvas(WIDTH, HEIGHT);
var ctx2 = canvas2.getContext('2d');
var _ = require('underscore');



function ImageData(data){
	this.imageData = data;
}

ImageData.prototype.isSimilarPixel = function(x1, y1, x2, y2){
	var p1 = y1 * WIDTH * 4 + x1 * 4;
	var p2 = y2 * WIDTH * 4 + x2 * 4;
	var r1 = this.imageData.data[p1];
	var g1 = this.imageData.data[p1+1];
	var b1 = this.imageData.data[p1+2];
	var r2 = this.imageData.data[p2];
	var g2 = this.imageData.data[p2+1];
	var b2 = this.imageData.data[p2+2];
	var likePercent = (255 - Math.abs(r1 - r2) * 0.297 - Math.abs(g1 - g2) * 0.593 - Math.abs(b1 - b2) * 0.11) / 255;
	if(likePercent > 0.9 || (r1+g1+b1 < 100)){
		return [255,255,255];
	}else{

		var grey = r1*0.3 + g1*0.59 + b1*0.11
		return [r1 /2,g1/2,b1/2]
		// return grey > 200? [255,255,255] : [0,0,0];
		// return [0,0,0]
	}
}

ImageData.prototype.getPosIsWhite = function(x,y){
	if(x >= WIDTH || x <= 0 || y >= HEIGHT || y <= 0){
		return 1
	}else{
		var i = x * 4 + y* WIDTH * 4;
		if(this.imageData.data[i] == 255 && this.imageData.data[i + 1] == 255 && this.imageData.data[i + 2] == 255 ){
			return 1;
		}else{
			return 0;
		}
	
	}
}


ImageData.prototype.getAroundWhiteCount = function(x,y){
	var count = 0;
	 a1 = this.getPosIsWhite( x-1, y-1);
	 a2 = this.getPosIsWhite( x, y-1);
	 a3 = this.getPosIsWhite( x+1, y-1);
	 a4 = this.getPosIsWhite( x-1, y);
	 a6 = this.getPosIsWhite( x+1, y);
	 a7 = this.getPosIsWhite( x-1, y+1);
	 a8 = this.getPosIsWhite( x, y+1);
	 a9 = this.getPosIsWhite( x+1, y+1);
	count = a1 + a2 + a3 + a4 + a6 + a7 + a8 + a9;
	// if(count == 6 && ( (a1+a9 == 0) || (a4+a6 == 0))){
	// 	count ++;
	// }
	return count;
}

ImageData.prototype.getImageData = function(){
	return this.imageData;
}

ImageData.prototype.setPixelData = function(x,y,r,g,b,a){
	var i = x * 4 + y* WIDTH * 4;
	this.imageData.data[ i ] = r;
	this.imageData.data[ i + 1] = g;
	this.imageData.data[ i + 2] = b;
	this.imageData.data[ i + 3] = a || 255;
}


ImageData.prototype.clearBackground = function(){
	for(var i=0;i< this.imageData.data.length;i+=4){
		if(this.imageData.data[i+3] !== 255){
			log(this.imageData.data[i+3], 'red')
		}
		var x = parseInt(i % (WIDTH * 4) / 4);
		var y = parseInt(i / (WIDTH * 4));
		if( x > 4){
			// var x
			var j = x % 5;
			var k = y * 4 * WIDTH + j * 4;
			if(y == 0 && x < 30){
				// log(`x:(${x},${y}) k:${k} i:${i}  rgba(${imageData.data[i]},${imageData.data[i+1]},${imageData.data[i+2]}) rgba(${imageData.data[k]},${imageData.data[k+1]},${imageData.data[k+2]}) `)
			} 
			var pixel = this.isSimilarPixel(x,y, j,y);


			this.setPixelData(x, y, pixel[0], pixel[1], pixel[2]);

		}
	 
	}

	for(var i=0;i< this.imageData.data.length;i+=4){
		var x = parseInt(i % (WIDTH * 4) / 4);
		var y = parseInt(i / (WIDTH * 4));
			//清除首列
		if( x < 5){
			this.setPixelData(x, y, 255,255,255);
		}

		if(this.imageData.data[i] < 250){
			
			var count = this.getAroundWhiteCount( x, y);
			if( count >=7){
				// log(`${x},${y} = ${count} rgba(${imageData.data[i]},${imageData.data[i+1]},${imageData.data[i+2]})`)
				this.setPixelData(x, y, 255,255,255);
			}

		}
	}
}


function processImage(index){
	var img = new Image();
	var src = path.join( __dirname , './img_src/img_'+ index +'.jpg');
	img.src  =  src;

	ctx1.drawImage(img, 0, 0, WIDTH, HEIGHT, 0, 0,WIDTH, HEIGHT);

	log('开始处理' + src);

	var imageData = ctx1.getImageData(0,0,WIDTH,HEIGHT);
	var data = new ImageData(imageData);
	data.clearBackground();

	ctx2.putImageData(data.getImageData(),0,0);
	var data = canvas2.toDataURL();
	data = data.replace('data:image/png;base64,','');

	fs.writeFile( `img_dist/img_${index}.png`, new Buffer(data, 'base64'));
	// fs.writeFile( `test.png`, new Buffer(data, 'base64'));
	// log('图片处理完毕','yellow');
}

processImage(1)
module.exports = processImage;
