import asyncio
import websockets
import uuid
import logging
from config import 用户_ID, HTTP_PROXY_LIST, USE_PROXY

logger = logging.getLogger(__name__)

async def 连接到_wss(http_proxy=None):
    uri = 'wss://proxy.wynd.network:4650/'

    while True:
        try:
            # 判断是否使用代理
            connection_params = {"uri": uri}
            if USE_PROXY and http_proxy:
                connection_params["proxy"] = http_proxy

            # 根据是否使用代理来建立连接
            async with websockets.connect(**connection_params) as websocket:
                logger.info('WebSocket 连接已打开')

                async def 发送_ping():
                    while True:
                        消息 = {
                            'id': str(uuid.uuid4()),
                            'version': '1.0.0',
                            'action': 'PING',
                            'data': {}
                        }
                        await websocket.send(str(消息))
                        logger.debug(f'发送: {消息}')
                        await asyncio.sleep(20)

                asyncio.create_task(发送_ping())

                while True:
                    响应 = await websocket.recv()
                    logger.info(f'接收: {响应}')

        except Exception as e:
            logger.error(f'错误: {e}')
            logger.error(f'代理: {http_proxy}')
            await asyncio.sleep(1)
