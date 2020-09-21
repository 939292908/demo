# 打包命令:
# 渠道:30
# 环境:prod
# ./build_zip.sh
# 环境:test
# ./build_zip.sh test
# 渠道名称数组
exch_arr=(gmex ucex ukex lfsx cointobe xstar b20 gaar mememex xtoken btcex stcex gdex boex bma bseedex vp16 vp17 ooex cmex vp20 xmex vp22 vp23 vp24 vp25 bmex wjex vp28 vp29 vbit amberex vp32 umex vp34 vp35 kmex rockbit vp38 webi)

exchId=30
exchName=${exch_arr[$exchId]}
env=$1

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

_dir=''
if [[ $env = "test" ]];then
    mkdir test
    _dir=test/$exchName
else
    _dir=$exchName
fi

dir=$_dir/vpall/w/
echo $dir

mkdir $_dir
mkdir $_dir/vpall/
mkdir $_dir/vpall/w/

echo mkdir $dir

echo ./static $dir
cp -av ./static $dir
cp -av ./index.html $dir

echo rm -rf ./static ./index.html
rm -rf ./static
rm -rf ./index.html

if [[ $env = "test" ]];then
    echo zip -r $exchName"-pc-web-beta-"$(date +%m%d%H%M)'.zip' test
    zip -r $exchName"-pc-web-beta-"$(date +%m%d%H%M)'.zip' test
else
    echo zip -r $exchName"-pc-web-"$(date +%m%d%H%M)'.zip'  $exchName
    zip -r $exchName"-pc-web-"$(date +%m%d%H%M)'.zip'  $exchName
fi

