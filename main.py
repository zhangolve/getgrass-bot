import asyncio
from connect_to_wss import 连接到_wss
from config import HTTP_PROXY_LIST, USE_PROXY

async def main():
    if USE_PROXY and HTTP_PROXY_LIST:
        tasks = [连接到_wss(proxy) for proxy in HTTP_PROXY_LIST]
    else:
        tasks = [连接到_wss()]  # 不使用代理时，直接连接
    await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())
