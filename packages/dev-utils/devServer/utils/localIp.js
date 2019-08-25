
const internalIp = require('internal-ip');

module.exports = () => internalIp.v4.sync();