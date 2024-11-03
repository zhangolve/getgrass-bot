require('./src/Bot'); // 导入Bot类
const Config = require('./src/Config'); // 导入Config类
const {
  fetchProxies,
  readLines,
  selectProxySource,
} = require('./src/ProxyManager'); // 导入代理管理器函数
const { delay } = require('./src/utils'); // 导入延迟函数

function displayHeader() { // 显示头部信息的函数
  process.stdout.write('\x1Bc'); // 清屏
  console.log('========================================'.cyan);
  console.log('=        小草第二季 - V2        ='.cyan);
  console.log('========================================'.cyan);
  console.log();
}

async function main() { // 主函数
  displayHeader(); // 显示头部信息
  console.log(`请稍候...\n`.yellow);

  await delay(1000); // 延迟1秒

  const config = new Config(); // 创建配置实例
  const bot = new Bot(config); // 创建Bot实例

  const proxySource = await selectProxySource(inquirer); // 选择代理来源

  let proxies; // 代理变量
  if (proxySource.type === 'file') { // 如果是文件来源
    proxies = await readLines(proxySource.source); // 读取代理文件
  } else { // 否则为URL来源
    proxies = await fetchProxies(proxySource.source); // 获取代理
  }

  if (proxies.length === 0) { // 如果没有代理
    console.error('未找到代理，退出...'.red); // 输出错误信息
    return; // 退出
  }

  console.log(`加载了 ${proxies.length} 个代理`.green); // 输出加载的代理数量

  const userIDs = await readLines('uid.txt'); // 读取用户ID文件
  if (userIDs.length === 0) { // 如果没有用户ID
    console.error('uid.txt中未找到用户ID，退出...'.red); // 输出错误信息
    return; // 退出
  }

  console.log(`加载了 ${userIDs.length} 个用户ID\n`.green); // 输出加载的用户ID数量

  for (const userID of userIDs) { // 遍历用户ID
    proxies.forEach((proxy) => bot.connectToProxy(proxy, userID)); // 连接每个代理
  }
}

main().catch(console.error); // 执行主函数并捕获错误
