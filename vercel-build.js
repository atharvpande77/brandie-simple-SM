// vercel-build.js
const { execSync } = require('child_process');

try {
  console.log('Running prisma generate...');
  execSync('npx prisma generate');
  console.log('Prisma client generated successfully!');
} catch (error) {
  console.error('Prisma generation failed:', error);
  process.exit(1);
}