require('colors'); // 导入颜色模块
const axios = require('axios'); // 导入axios库
const fs = require('fs'); // 导入文件系统模块

const PROXY_SOURCES = { // 代理来源
  'SERVER 1': 'https://files.ramanode.top/airdrop/grass/server_1.txt',
  'SERVER 2': 'https://files.ramanode.top/airdrop/grass/server_2.txt',
  'SERVER 3': 'https://files.ramanode.top/airdrop/grass/server_3.txt',
  'SERVER 4': 'https://files.ramanode.top/airdrop/grass/server_4.txt',
  'SERVER 5': 'https://files.ramanode.top/airdrop/grass/server_5.txt',
  'SERVER 6': 'https://files.ramanode.top/airdrop/grass/server_6.txt',
};

async function fetchProxies(url) { // 获取代理的异步函数
  try {
    const response = await axios.get(url); // 发送请求获取代理
    console.log(`从 ${url} 获取代理成功`.green);
    return response.data.split('\n').filter(Boolean); // 返回代理数组
  } catch (error) {
    console.error(`从 ${url} 获取代理失败: ${error.message}`.red); // 输出错误信息
    return []; // 返回空数组
  }
}

async function readLines(filename) { // 读取文件行的异步函数
  try {
    const data = await fs.promises.readFile(filename, 'utf-8'); // 读取文件
    console.log(`从 ${filename} 加载数据成功`.green);
    return data.split('\n').filter(Boolean); // 返回数据数组
  } catch (error) {
    console.error(`读取 ${filename} 失败: ${error.message}`.red); // 输出错误信息
    return []; // 返回空数组
  }
}

async function selectProxySource(inquirer) { // 选择代理来源的异步函数
  const choices = [...Object.keys(PROXY_SOURCES), 'CUSTOM']; // 代理来源选项
  const { source } = await inquirer.prompt([ // 询问用户选择
    {
      type: 'list',
      name: 'source',
      message: '选择代理来源:'.cyan,
      choices,
    },
  ]);

  if (source === 'CUSTOM') { // 如果选择自定义
    const { filename } = await inquirer.prompt([ // 询问文件路径
      {
        type: 'input',
        name: 'filename',
        message: '输入你的 proxy.txt 文件路径:'.cyan,
        default: 'proxy.txt', // 默认文件名
      },
    ]);
    return { type: 'file', source: filename }; // 返回文件来源
  }

  return { type: 'url', source: PROXY_SOURCES[source] }; // 返回URL来源
}

module.exports = { fetchProxies, readLines, selectProxySource }; // 导出函数
