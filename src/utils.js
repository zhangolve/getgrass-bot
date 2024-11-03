require('colors');

const BOLD = '\033[1m';
const NORMAL = '\033[0m';
const BLUE = '\033[1;34m';
const GREEN = '\033[0;32m';
const YELLOW = '\033[1;33m';
const RED = '\033[0;31m';
const RESET = '\033[0m';

// 图标定义
const INFO_ICON = 'ℹ️';
const SUCCESS_ICON = '✅';
const WARNING_ICON = '⚠️';
const ERROR_ICON = '❌';

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function displayHeader() {
    process.stdout.write('\x1Bc');
    console.log(`${YELLOW}╔════════════════════════════════════════╗`);
    console.log(`${YELLOW}║      🚀  小草第二季空投 🚀                 ║`);
    console.log(`${YELLOW}║  👤    脚本编写：@qklxsqf              ║`);
    console.log(`${YELLOW}║  📢  电报频道：https://t.me/ksqxszq    ║`);
    console.log(`${YELLOW}╚════════════════════════════════════════╝`);
    console.log(); // 空行
}

// 信息显示函数
function log_info(message) {
    console.log(`${BLUE}${INFO_ICON} ${message}${RESET}`);
}

function log_success(message) {
    console.log(`${GREEN}${SUCCESS_ICON} ${message}${RESET}`);
}

function log_warning(message) {
    console.log(`${YELLOW}${WARNING_ICON} ${message}${RESET}`);
}

function log_error(message) {
    console.log(`${RED}${ERROR_ICON} ${message}${RESET}`);
}

module.exports = { delay, displayHeader, log_info, log_success, log_warning, log_error };

