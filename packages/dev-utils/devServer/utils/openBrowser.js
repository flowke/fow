const { execSync } = require('child_process');

module.exports = (url) => {
  execSync('ps cax | grep "Google Chrome"');
  execSync(
    `osascript chrome.applescript "${encodeURI(url)}"`,
    {
      cwd: __dirname,
      stdio: 'ignore',
    }
  );
}