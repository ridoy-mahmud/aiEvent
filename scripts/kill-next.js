// Kill any running Next.js processes
const { exec } = require('child_process');
const os = require('os');

const platform = os.platform();

if (platform === 'win32') {
  // Windows
  exec('taskkill /F /IM node.exe', (error) => {
    if (error) {
      console.log('No Next.js processes found or already stopped');
    } else {
      console.log('✅ Killed Next.js processes');
    }
  });
} else {
  // Linux/Mac
  exec('pkill -f "next dev"', (error) => {
    if (error) {
      console.log('No Next.js processes found or already stopped');
    } else {
      console.log('✅ Killed Next.js processes');
    }
  });
}

