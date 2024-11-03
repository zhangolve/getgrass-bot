class Configuration {
  constructor() {
    this.ipCheckURL = 'https://ipinfo.io/json'; // IP检查URL
    this.wssHost = 'proxy.your-domain.com:4444'; // WebSocket服务器地址
    this.retryInterval = 20000; // 重试间隔（20秒）
  }
}

module.exports = Configuration; // 导出Configuration类

