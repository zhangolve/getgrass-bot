# getgrass-bot
此仓库包含 getgrass-bot 的代码，这是一个旨在通过各种 HTTP 代理执行 WebSocket 连接的机器人。

## 概述
getgrass-bot 通过 HTTP 代理与指定的 WebSocket 服务器建立连接。它使用 websockets 库进行 WebSocket 通信，并支持通过 HTTP 代理进行连接。

## 安装
将此仓库克隆到本地计算机。
进入项目目录。
安装依赖项：
bash
复制代码
pip install -r requirements.txt
## 使用
打开 config.py 文件，使用文本编辑器进行编辑。

获取你的用户 ID：

登录到 Getgrass 网站，访问 https://app.getgrass.io/dashboard。
在账户设置或个人资料页面中查找用户 ID。
复制该用户 ID。
修改 config.py 文件中的 用户_ID 变量，将其替换为你的用户 ID。

更新 HTTP_PROXY_LIST 数组，添加所需的 HTTP 代理 URL。确保每个 URL 的格式为 http://用户名:密码@主机名:端口。

保存对 config.py 的更改。

运行 getgrass-bot，执行以下命令：

bash
复制代码
python main.py
## 配置
在 config.py 文件中：

修改 用户_ID 变量为你的用户 ID。
更新 HTTP_PROXY_LIST 数组，添加所需的 HTTP 代理 URLs。确保每个 URL 的格式为 http://用户名:密码@主机名:端口。
