// 通过rollup进行打包
//（1）引入相关依赖
import { createRequire } from 'node:module'
import ts from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve';
import path, { format } from 'node:path';
import { fileURLToPath } from 'node:url';
import css from "rollup-plugin-import-css";
import vuePlugin from 'rollup-plugin-vue';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';


import { terser } from 'rollup-plugin-terser';

import { uglify } from "rollup-plugin-uglify";


const require = createRequire(import.meta.url)

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// （2）获取文件路径

const packagesDir = path.resolve(__dirname, 'packages');

// （2.1）获取需要打包的包
let packageDir = path.resolve(packagesDir, process.env.TARGET);

// 2.2 打包获取每个包的项目配置
const resolve = p => path.resolve(packageDir, p);
const pkg = require(resolve(`package.json`))
const name = path.basename(packageDir);
// 3 创建一个表
const outputOptions = {
    'esm-bundler': {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    'cjs': {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    'global': {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife'
    },
    'umd': {
        file: resolve(`dist/${name}.umd.js`),
        format: 'umd',
        name: name
    }
};

const options = pkg.buildOptions;
// rollup需要导出一个配置
function createConfig(format, output) {
    // 进行打包
    output.name = options.name,
    output.sourcemap = false;
    // 生成rollup配置
    return {
        input: resolve(options.enter),
        output,
        external: ['lodash-es', 'vue'],
        // 插件一定要按配置
        plugins: [
            // uglify(),
            image(),
            json(),
            ts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            resolvePlugin(),
            css(),
            vuePlugin(),
            // terser({
            //     format: {
            //         comments: false
            //     }
            // })
            commonjs()
        ],
    }
}
const rollupConfig = options.formats.map(format => createConfig(format, outputOptions[format]));
export default rollupConfig;
