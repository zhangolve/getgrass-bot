# 主入口文件

import asyncio
from connect_to_wss import 连接到_wss
from config import HTTP_PROXY_LIST

async def main():
    任务 = [连接到_wss(代理) for 代理 in HTTP_PROXY_LIST]
    await asyncio.gather(*任务)

if __name__ == '__main__':
    asyncio.run(main())
