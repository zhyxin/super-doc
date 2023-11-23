// 进行打包 monerepe
// （1）获取打包目录
// 
import execa from 'execa';

//（2）进行打包 并行打包

async function build(target) {
    console.log(target);
    // 注意execa -c 执行rollup配置，环境变量 -env
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {stdio: 'inherit'})
}

build('core');
build('api');
// 注意 文件夹
