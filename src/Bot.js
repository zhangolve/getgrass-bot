const WebSocket = require('ws'); // 导入WebSocket库
const axios = require('axios'); // 导入axios库
const { v4: generateUUID } = require('uuid'); // 导入UUID生成器
const { SocksProxyAgent } = require('socks-proxy-agent'); // 导入Socks代理类
const { HttpsProxyAgent } = require('https-proxy-agent'); // 导入HTTPS代理类
require('colors'); // 导入颜色模块

class ProxyBot {
  constructor(settings) {
    this.settings = settings; // 保存配置
  }

  async fetchProxyDetails(proxy) {
    const agent = proxy.startsWith('http') ? new HttpsProxyAgent(proxy) : new SocksProxyAgent(proxy); // 创建代理
    try {
      const response = await axios.get(this.settings.ipCheckURL, { httpsAgent: agent });
      console.log(`成功通过代理 ${proxy} 连接`.green);
      return response.data; // 返回代理信息
    } catch (err) {
      console.error(`连接代理 ${proxy} 失败: ${err.message}`.yellow);
      return null; // 返回null
    }
  }

  async establishConnection(proxy, userID) {
    const formattedProxy = proxy.startsWith('socks5://') ? proxy : `socks5://${proxy}`; // 格式化代理
    const proxyDetails = await this.fetchProxyDetails(formattedProxy); // 获取代理信息

    if (!proxyDetails) return; // 如果没有获取到代理信息，返回

    try {
      const agent = formattedProxy.startsWith('http') ? new HttpsProxyAgent(formattedProxy) : new SocksProxyAgent(formattedProxy);
      const wsEndpoint = `wss://${this.settings.wssHost}`; // WebSocket地址
      const websocket = new WebSocket(wsEndpoint, {
        agent,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          pragma: 'no-cache',
          Origin: 'chrome-extension://your-extension-id',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
      });

      websocket.on('open', () => {
        console.log(`已连接到 ${proxy}`.cyan);
        console.log(`代理信息: ${JSON.stringify(proxyDetails)}`.magenta);
        this.pingServer(websocket, proxyDetails.ip); // 发送ping
      });

      websocket.on('message', (data) => {
        const message = JSON.parse(data);
        console.log(`收到消息: ${JSON.stringify(message)}`.blue);

        if (message.action === 'AUTH') {
          const responseAuth = {
            id: message.id,
            origin_action: 'AUTH',
            result: {
              browser_id: generateUUID(),
              user_id: userID,
              user_agent: 'Mozilla/5.0',
              timestamp: Math.floor(Date.now() / 1000),
              device_type: 'extension',
              extension_id: 'your-extension-id',
              version: '4.26.2',
            },
          };
          websocket.send(JSON.stringify(responseAuth)); // 发送认证响应
          console.log(`已发送认证响应: ${JSON.stringify(responseAuth)}`.green);
        } else if (message.action === 'PONG') {
          console.log(`收到PONG: ${JSON.stringify(message)}`.blue);
        }
      });

      websocket.on('close', (code, reason) => {
        console.log(`WebSocket关闭，代码: ${code}, 原因: ${reason}`.yellow);
        setTimeout(() => this.establishConnection(proxy, userID), this.settings.retryInterval);
      });

      websocket.on('error', (err) => {
        console.error(`WebSocket连接错误: ${err.message}`.red);
        websocket.terminate(); // 终止连接
      });
    } catch (err) {
      console.error(`无法连接到代理 ${proxy}: ${err.message}`.red);
    }
  }

  pingServer(ws, proxyIP) {
    setInterval(() => {
      const pingPayload = {
        id: generateUUID(),
        version: '1.0.0',
        action: 'PING',
        data: {},
      };
      ws.send(JSON.stringify(pingPayload)); // 发送ping消息
      console.log(`已发送ping - IP: ${proxyIP}, 消息: ${JSON.stringify(pingPayload)}`.cyan);
    }, 26000); // 每26秒发送一次
  }
}

module.exports = ProxyBot; // 导出ProxyBot类
