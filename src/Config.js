class Config { // 配置类
  constructor() { // 构造函数
    this.ipCheckURL = 'https://ipinfo.io/json'; // IP检查URL
    this.wssHost = 'proxy.wynd.network:4444'; // WebSocket服务器地址
    this.retryInterval = 20000; // 重试间隔（20秒）
  }
}

module.exports = Config; // 导出Config类
