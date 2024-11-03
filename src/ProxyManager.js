const axios = require('axios'); // 导入axios库
const fs = require('fs'); // 导入文件系统模块
require('colors'); // 导入颜色模块

const PROXY_SOURCES = {
  'SOURCE 1': 'https://example.com/proxies1.txt',
  'SOURCE 2': 'https://example.com/proxies2.txt',
  // 其他源...
};

async function retrieveProxies(sourceURL) {
  try {
    const response = await axios.get(sourceURL);
    console.log(`成功从 ${sourceURL} 获取代理`.green);
    return response.data.split('\n').filter(Boolean);
  } catch (err) {
    console.error(`获取代理失败: ${err.message}`.red);
    return [];
  }
}

async function loadLines(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    console.log(`成功加载 ${filePath}`.green);
    return data.split('\n').filter(Boolean);
  } catch (err) {
    console.error(`读取文件 ${filePath} 失败: ${err.message}`.red);
    return [];
  }
}

async function chooseProxySource(inquirer) {
  const choices = [...Object.keys(PROXY_SOURCES), '自定义']; // 代理来源选项
  const { source } = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: '请选择代理来源:'.cyan,
      choices,
    },
  ]);

  if (source === '自定义') {
    const { filename } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filename',
        message: '输入你的 proxy.txt 文件路径:'.cyan,
        default: 'proxy.txt', // 默认文件名
      },
    ]);
    return { type: 'file', source: filename };
  }

  return { type: 'url', source: PROXY_SOURCES[source] }; // 返回URL来源
}

module.exports = { retrieveProxies, loadLines, chooseProxySource }; // 导出函数

