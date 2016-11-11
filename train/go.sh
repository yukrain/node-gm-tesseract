# rem 执行改批处理前先要目录下创建font_properties文件 

echo Run Tesseract for Training.. 
tesseract yuk.font.exp0.tif yuk.font.exp0 nobatch box.train 
 
echo Compute the Character Set.. 
unicharset_extractor yuk.font.exp0.box 
mftraining -F font_properties -U unicharset -O yuk.unicharset yuk.font.exp0.tr 


echo Clustering.. 
cntraining yuk.font.exp0.tr 

echo Rename Files.. 
mv normproto yuk.normproto 
mv inttemp yuk.inttemp 
mv pffmtable yuk.pffmtable 
mv shapetable yuk.shapetable  

echo Create Tessdata.. 
combine_tessdata yuk. 

# echo. & pause