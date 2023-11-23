// 进行打包 monerepe
// （1）获取打包目录
// 
import execa from 'execa'
import fs from 'node:fs'
const dirs = fs.readdirSync('packages').filter(p => {
    if(!fs.statSync(`packages/${p}`).isDirectory()) {
        return false;
    }
    return true;
});

//（2）进行打包 并行打包

async function build(target) {
    // 注意execa -c 执行rollup配置，环境变量 -env
    await execa('rollup', ['-wc', '--environment', `TARGET:${target}`], {stdio: 'inherit'})
}

async function runParaller(dirs, itemfn) {
    // 遍历
    let result = [];
    for(let item of dirs) {
        result.push(itemfn(item));
    }

    return Promise.all(result); // 存放打包的promise， 等待这里的打包执行完毕之后，调用成功
}
const excludes = ['types', 'typing', 'vue-project', 'vueDemo'];
runParaller(dirs.filter(dir => !excludes.includes(dir)), build).then(() => {
    console.log('成功');
});
// runParaller(['vue-project'], build).then(() => {
//     console.log('成功');
// });
// 注意 文件夹
console.log(dirs);
