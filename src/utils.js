const delayFunction = async (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)); // 延迟函数

module.exports = { delayFunction }; // 导出延迟函数
