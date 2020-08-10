#静态资源分开打包
#打包命令:
#渠道:21
#环境:test/prod
# ./build_www_web_single.sh 21 test
# 渠道名称数组
exch_arr=(gmex ucex ukex lfsx cointobe xstar b20 gaar mememex xtoken btcex stcex gdex boex bma bseedex vp16 vp17 ooex cmex vp20 xmex vp22 vp23 vp24 vp25 bmex wjex vp28 vp29 vbit amberex vp32 umex vp34 vp35 kmex rockbit vp38 webi)

exchId=21
exchName=${exch_arr[$exchId]}

echo $exchId
echo $exchName

echo rm -rf ./dist
rm -rf ./dist

echo npm i
npm i

echo npm run build
npm run build

echo cd ./dist
cd ./dist

dir=$exchName/vpall/w/trd/
echo $dir

mkdir $exchName
mkdir $exchName/vpall/
mkdir $exchName/vpall/w/
mkdir $dir

echo mkdir $dir

echo ./css $dir
cp -av ./css $dir
cp -av ./img $dir
cp -av ./libs $dir
cp -av ./main.js $dir
cp -av ./index.html $dir

echo rm -rf ./css ./img ./libs ./main.js ./index.html
rm -rf ./css
rm -rf ./img
rm -rf ./libs
rm -rf ./main.js
rm -rf ./index.html

echo zip -r $exchName"-pc-trd-"$(date +%m%d%H%M)'.zip'  $exchName
zip -r $exchName"-pc-trd-"$(date +%m%d%H%M)'.zip'  $exchName
