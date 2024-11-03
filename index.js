const ProxyBot = require('./src/Bot'); // 导入ProxyBot类
const Configuration = require('./src/Config'); // 导入Configuration类
const { retrieveProxies, loadLines, chooseProxySource } = require('./src/ProxyManager'); // 导入代理管理函数
const { delayFunction } = require('./src/utils'); // 导入延迟函数
const inquirer = require('inquirer'); // 导入inquirer库
require('colors'); // 导入颜色模块

function showHeader() {
  process.stdout.write('\x1Bc'); // 清屏
  console.log('========================================'.cyan);
  console.log('=        Proxy Bot V2          ='.cyan);
  console.log('========================================'.cyan);
  console.log();
}

async function main() {
  showHeader(); // 显示头部信息
  console.log(`请稍候...\n`.yellow);

  await delayFunction(1000); // 延迟1秒

  const config = new Configuration(); // 创建配置实例
  const bot = new ProxyBot(config); // 创建Bot实例

  const proxySource = await chooseProxySource(inquirer); // 选择代理来源

  let proxies;
  if (proxySource.type === 'file') {
    proxies = await loadLines(proxySource.source); // 从文件读取代理
  } else {
    proxies = await retrieveProxies(proxySource.source); // 从URL获取代理
  }

  if (proxies.length === 0) {
    console.error('未找到代理，退出...'.red);
    return; // 退出
  }

  console.log(`加载了 ${proxies.length} 个代理`.green);

  const userIDs = await loadLines('uid.txt'); // 读取用户ID文件
  if (userIDs.length === 0) {
    console.error('未找到用户ID，退出...'.red);
    return; // 退出
  }

  console.log(`加载了 ${userIDs.length} 个用户ID\n`.green);

  for (const userID of userIDs) {
    for (const proxy of proxies) {
      await bot.establishConnection(proxy, userID); // 连接每个代理
    }
  }
}

main().catch((err) => {
  console.error(`出现错误: ${err.message}`.red);
});
