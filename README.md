 # @GetGrass-Bot
欢迎来到 GetGrass-Bot 项目！这是一个专为草地空投第二季设计的机器人，能够通过各种 HTTP 和 SOCKS 代理建立 WebSocket 连接，助你在空投中高效耕作。

## 项目概述
GetGrass-Bot 通过 HTTP 和 SOCKS 代理与指定的 WebSocket 服务器进行连接。我们使用 ws 库处理 WebSocket 通信，同时结合 https-proxy-agent 和 socks-proxy-agent 库，以支持多种代理类型，从而实现更灵活和稳定的连接。

## 安装步骤
将此仓库克隆到你的本地环境：

 ```bash
git clone https://github.com/ziqing888/getgrass-bot.git

 ```
进入项目目录：
 ```bash
cd getgrass-bot
 ```
## 安装所需依赖项：
 ```bash
npm install
 ```

## 使用说明
获取用户 ID：

登录到 GetGrass 网站。

打开浏览器开发者工具（通常按 F12 或右键选择“检查”）。

切换到“控制台”选项卡。

输入以下命令并按回车：

```bash
localStorage.getItem('userId');
 ```
复制返回的值，这就是你的用户 ID。

创建用户 ID 文件：

在项目目录中创建一个名为 uid.txt 的文件，每行写一个用户 ID，例如：

```bash
123123213
12313123
```
添加代理信息：

创建一个名为 proxy.txt 的文件，并按行添加你的代理 URL，格式如下：
```bash

http://username:password@hostname:port
socks5://username:password@hostname:port
```
启动机器人：

在终端中执行以下命令运行 GetGrass-Bot：
```bash
npm start

```
