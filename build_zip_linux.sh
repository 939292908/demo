# 打包命令:
# 渠道:30
# 环境:prod
# ./build_zip_linux.sh
# 环境:test
# ./build_zip_linux.sh test
# 渠道名称数组
exch_arr=(gmex ucex ukex lfsx cointobe xstar b20 gaar mememex xtoken btcex stcex gdex boex bma bseedex vp16 vp17 ooex cmex vp20 xmex vp22 vp23 vp24 vp25 bmex wjex vp28 vp29 vbit amberex vp32 umex vp34 vp35 kmex rockbit vp38 webi)

exchId=3
exchName=${exch_arr[$exchId]}
env=$1
cdnHost="static.abkjl.com"
publicPath="https\:\/\/$cdnHost\/vp$exchId\/w\/user\/"
if [[ $env = "test" ]];then
    publicPath="https\:\/\/$cdnHost\/test\/vp$exchId\/w\/user\/"
else
    echo not test
fi

echo $exchId
echo $exchName

echo rm -rf ./dist
rm -rf ./dist

# echo npm i
# npm i

# 修改publicPath
sed -i 's/const publicPath = .*/const publicPath = "'$publicPath'";/g' ./webpack/webpack.prod.conf.js

echo npm run build
npm run build

# 打包完成后恢复js文件修改
git checkout ./webpack/webpack.prod.conf.js

git checkout 

echo cd ./dist
cd ./dist

_dir=''
if [[ $env = "test" ]];then
    mkdir test
    _dir=test/$exchName
else
    _dir=$exchName
fi

dir=$_dir/vpall/w/user
echo $dir

mkdir $_dir
mkdir $_dir/vpall/
mkdir $_dir/vpall/w/
mkdir $dir

echo mkdir $dir

echo ./static $dir
# cp -av ./static $dir
cp -av ./index.html $dir

mkdir $cdnHost
_dir=vp$exchId
if [[ $env = "test" ]];then
    _dir=test/vp$exchId
    mkdir $cdnHost/test
    mkdir $cdnHost/$_dir
else
    mkdir $cdnHost/$_dir
fi
mkdir $cdnHost/$_dir/w
mkdir $cdnHost/$_dir/w/user

cp -av ./static $cdnHost/$_dir/w/user

echo rm -rf ./static ./index.html
rm -rf ./static
rm -rf ./index.html

if [[ $env = "test" ]];then
    echo zip -r $exchName"-pc-web-beta-"$(date +%m%d%H%M)'.zip' test
    zip -r $exchName"-pc-web-beta-"$(date +%m%d%H%M)'.zip' test
    zip -r "$cdnHost"-$exchName"-pc-web-beta-"$(date +%m%d%H%M)'.zip' $cdnHost
else
    echo zip -r $exchName"-pc-web-"$(date +%m%d%H%M)'.zip'  $exchName
    zip -r $exchName"-pc-web-"$(date +%m%d%H%M)'.zip'  $exchName
    zip -r "$cdnHost"-$exchName"-pc-web-"$(date +%m%d%H%M)'.zip' $cdnHost
fi


