# node-gm-tesseract
node验证码识别：使用GraphicsMagick和Tesseract识别 


#### 启动
```
    #处理图片并识别
 	npm run start 

 	#转化为tif格式 
 	npm run tif 
```


#### 目录说明
- img_src 原始素材
- img_dist 处理后png文件, 用于识别
- img_tesseract 处理后tiff文件, 用于训练

#### 识别思路
- 1.处理图片，提取色值
- 2.二值化图片
- （3.训练）
- 4.识别

#### 安装问题

下载 XQuartz-2.7.11.dmg
升级 Xcode 到8.x
```
	brew install tesseract --with-training-tools
```



####说明与结果
识别结果不尽如人意，可能是图片处理需要优化，比如分割等等。另外训练样本不够导致识别率也不是非常高。文字重叠的时候很难识别。



#### 提高识别率训练

http://www.cnblogs.com/cnlian/p/5765871.html
注意文中的脚本x需要稍作修改


#### 资料
-《用node.js实现验证码简单识别》https://cnodejs.org/topic/56addaf524b0c1ec628ff0f6

-《Tesseract-OCR的简单使用与训练》http://www.cnblogs.com/cnlian/p/5765871.html

-《GraphicsMagick for node.js》http://aheckmann.github.io/gm/docs.html

-《mageMagick：批量处理图像的超级利器》 http://blog.sina.com.cn/s/blog_ba532aea0101bty5.html