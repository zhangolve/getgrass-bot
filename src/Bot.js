require('colors'); // 导入颜色模块
const WebSocket = require('ws'); // 导入WebSocket库
const axios = require('axios'); // 导入axios库
const { v4: uuidv4 } = require('uuid'); // 导入UUID生成器
const { SocksProxyAgent } = require('socks-proxy-agent'); // 导入Socks代理代理类
const { HttpsProxyAgent } = require('https-proxy-agent'); // 导入HTTPS代理代理类

class Bot { // Bot类
  constructor(config) { // 构造函数
    this.config = config; // 保存配置
  }

  async getProxyIP(proxy) { // 获取代理IP的异步函数
    const agent = proxy.startsWith('http')
      ? new HttpsProxyAgent(proxy)
      : new SocksProxyAgent(proxy); // 根据代理类型选择代理代理类
    try {
      const response = await axios.get(this.config.ipCheckURL, {
        httpsAgent: agent,
      }); // 获取IP信息
      console.log(`通过代理 ${proxy} 连接成功`.green);
      return response.data; // 返回IP信息
    } catch (error) {
      console.error(
        `由于连接错误，跳过代理 ${proxy}: ${error.message}`.yellow
      ); // 输出错误信息
      return null; // 返回null
    }
  }

  async connectToProxy(proxy, userID) { // 连接代理的异步函数
    const formattedProxy = proxy.startsWith('socks5://')
      ? proxy
      : proxy.startsWith('http')
      ? proxy
      : `socks5://${proxy}`; // 格式化代理
    const proxyInfo = await this.getProxyIP(formattedProxy); // 获取代理IP信息

    if (!proxyInfo) {
      return; // 如果未获取到信息则返回
    }

    try {
      const agent = formattedProxy.startsWith('http')
        ? new HttpsProxyAgent(formattedProxy)
        : new SocksProxyAgent(formattedProxy); // 根据代理类型选择代理代理类
      const wsURL = `wss://${this.config.wssHost}`; // WebSocket地址
      const ws = new WebSocket(wsURL, { // 创建WebSocket实例
        agent,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          pragma: 'no-cache',
          Origin: 'chrome-extension://lkbnfiajjmbhnfledhphioinpickokdi',
          'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
          'Cache-Control': 'no-cache',
        },
      });

      ws.on('open', () => { // 连接成功时的处理
        console.log(`连接到 ${proxy}`.cyan);
        console.log(`代理IP信息: ${JSON.stringify(proxyInfo)}`.magenta);
        this.sendPing(ws, proxyInfo.ip); // 发送ping
      });

      ws.on('message', (message) => { // 接收到消息时的处理
        const msg = JSON.parse(message); // 解析消息
        console.log(`接收到消息: ${JSON.stringify(msg)}`.blue);

        if (msg.action === 'AUTH') { // 如果是认证消息
          const authResponse = {
            id: msg.id,
            origin_action: 'AUTH',
            result: {
              browser_id: uuidv4(), // 生成浏览器ID
              user_id: userID,
              user_agent: 'Mozilla/5.0',
              timestamp: Math.floor(Date.now() / 1000), // 获取当前时间戳
              device_type: 'extension',
              extension_id: 'lkbnfiajjmbhnfledhphioinpickokdi',
              version: '4.26.2',
            },
          };
          ws.send(JSON.stringify(authResponse)); // 发送认证响应
          console.log(
            `发送认证响应: ${JSON.stringify(authResponse)}`.green
          );
        } else if (msg.action === 'PONG') { // 如果是pong消息
          console.log(`接收到PONG: ${JSON.stringify(msg)}`.blue);
        }
      });

      ws.on('close', (code, reason) => { // 连接关闭时的处理
        console.log(
          `WebSocket关闭，代码: ${code}, 原因: ${reason}`.yellow
        );
        setTimeout(
          () => this.connectToProxy(proxy, userID), // 重试连接
          this.config.retryInterval
        );
      });

      ws.on('error', (error) => { // 连接出错时的处理
        console.error(
          `代理 ${proxy} 的WebSocket错误: ${error.message}`.red
        );
        ws.terminate(); // 终止连接
      });
    } catch (error) {
      console.error(
        `无法使用代理 ${proxy} 连接: ${error.message}`.red
      ); // 输出错误信息
    }
  }

  sendPing(ws, proxyIP) { // 发送ping的函数
    setInterval(() => {
      const pingMessage = {
        id: uuidv4(), // 生成唯一ID
        version: '1.0.0',
        action: 'PING', // 设置动作为PING
        data: {},
      };
      ws.send(JSON.stringify(pingMessage)); // 发送ping消息
      console.log(
        `发送ping - IP: ${proxyIP}, 消息: ${JSON.stringify(pingMessage)}`.cyan
      );
    }, 26000); // 每26秒发送一次
  }
}

module.exports = Bot; // 导出Bot类
