const { execSync } = require('child_process');

if (process.env.USE_LEGACY_PEER_DEPS === 'true') {
  console.log('Rodando npm install --legacy-peer-deps...');
  execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
}
