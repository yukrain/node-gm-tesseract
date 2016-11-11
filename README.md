# node-gm-tesseract
node调用命令行使用GraphicsMagick和Tesseract识别 

## 启动
```
 	npm run start #启动并识别
 	npm run tif #生成测试tif格式 

```


#### 目录说明
img_src 原始素材
img_dist 处理后tiff文件


#### 识别思路
1.灰度化图片
2.二值化图片
3.训练
4.识别

#### 安装问题

下载 XQuartz-2.7.11.dmg
brew install tesseract --with-training-tools




#### 提高识别率训练


#### 资料
《用node.js实现验证码简单识别》https://cnodejs.org/topic/56addaf524b0c1ec628ff0f6
《Tesseract-OCR的简单使用与训练》http://www.cnblogs.com/cnlian/p/5765871.html
《GraphicsMagick for node.js》http://aheckmann.github.io/gm/docs.html
《mageMagick：批量处理图像的超级利器》 http://blog.sina.com.cn/s/blog_ba532aea0101bty5.html