require('colors');
const axios = require('axios');
const fs = require('fs');

const PROXY_SOURCES = {
  'SERVER 1': 'https://files.ramanode.top/airdrop/grass/server_1.txt',
  'SERVER 2': 'https://files.ramanode.top/airdrop/grass/server_2.txt',
  'SERVER 3': 'https://files.ramanode.top/airdrop/grass/server_3.txt',
  'SERVER 4': 'https://files.ramanode.top/airdrop/grass/server_4.txt',
  'SERVER 5': 'https://files.ramanode.top/airdrop/grass/server_5.txt',
  'SERVER 6': 'https://files.ramanode.top/airdrop/grass/server_6.txt',
};

async function fetchProxies(url) {
  try {
    const response = await axios.get(url);
    console.log(`从 ${url} 获取代理成功`.green);
    return response.data.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`从 ${url} 获取代理失败: ${error.message}`.red);
    return [];
  }
}

async function readLines(filename) {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    console.log(`从 ${filename} 加载数据成功`.green);
    return data.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`读取文件 ${filename} 失败: ${error.message}`.red);
    return [];
  }
}

async function selectProxySource(inquirer) {
  const questions = [
    {
      type: 'list',
      name: 'type',
      message: '请选择代理来源:',
      choices: Object.keys(PROXY_SOURCES).concat(['文件']),
    },
    {
      type: 'input',
      name: 'source',
      message: '请输入代理来源 URL:',
      when: (answers) => answers.type !== '文件',
      validate: (input) => {
        if (!input) {
          return 'URL不能为空';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'source',
      message: '请输入代理文件路径:',
      when: (answers) => answers.type === '文件',
      validate: (input) => {
        if (!input) {
          return '文件路径不能为空';
        }
        return true;
      },
    },
  ];

  const answers = await inquirer.prompt(questions);
  if (answers.type !== '文件') {
    answers.source = PROXY_SOURCES[answers.type];
  }
  return answers;
}

module.exports = {
  fetchProxies,
  readLines,
  selectProxySource,
};
