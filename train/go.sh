# rem 执行改批处理前先要目录下创建font_properties文件 

echo Run Tesseract for Training.. 
tesseract apple.font.exp0.tif apple.font.exp0 nobatch box.train 
 
echo Compute the Character Set.. 
unicharset_extractor apple.font.exp0.box 
mftraining -F font_properties -U unicharset -O apple.unicharset apple.font.exp0.tr 


echo Clustering.. 
cntraining apple.font.exp0.tr 

echo Rename Files.. 
mv normproto apple.normproto 
mv inttemp apple.inttemp 
mv pffmtable apple.pffmtable 
mv shapetable apple.shapetable  

echo Create Tessdata.. 
combine_tessdata apple. 

# echo. & pause