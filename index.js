require('colors');
const inquirer = require('inquirer');
const Bot = require('./src/Bot');
const Config = require('./src/Config');
const { fetchProxies, readLines, selectProxySource } = require('./src/ProxyManager');
const { delay, displayHeader, log_success, log_error, log_info } = require('./src/utils');

async function main() {
    displayHeader();
    log_info('请稍等...\n');

    await delay(1000);

    const config = new Config();
    const bot = new Bot(config);

    const proxySource = await selectProxySource(inquirer);

    let proxies;
    if (proxySource.type === 'file') {
        proxies = await readLines(proxySource.source);
    } else {
        proxies = await fetchProxies(proxySource.source);
    }

    if (proxies.length === 0) {
        log_error('未找到代理，退出...');
        return;
    }

    log_success(`加载了 ${proxies.length} 个代理`);

    const userIDs = await readLines('uid.txt');
    if (userIDs.length === 0) {
        log_error('uid.txt 中未找到用户 ID. 退出...');
        return;
    }

    log_success(`加载了 ${userIDs.length} 个用户 ID\n`);

    const connectionPromises = userIDs.flatMap((userID) =>
        proxies.map((proxy) => bot.connectToProxy(proxy, userID))
    );

    await Promise.all(connectionPromises);
}

main().catch(console.error);


