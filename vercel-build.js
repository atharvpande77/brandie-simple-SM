import { execSync } from 'child_process';

console.log('Generating Prisma client...');
try {
  execSync('npx prisma generate');
  console.log('Prisma client generated!');
} catch (error) {
  console.error('Prisma generation failed:', error);
  process.exit(1);
}