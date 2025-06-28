import * as fs from 'fs';
import * as path from 'path';

interface Config {
  outputFile: string;
  rootDir: string;
  includeExtensions: string[];
  includeDirs: string[];
  includeRootFiles: string[];
  excludeDirs: string[];
  excludeFiles: string[];
}

const OUTPUT_FILE = 'project-code.txt';

const config: Config = {
  outputFile: OUTPUT_FILE,
  rootDir: process.cwd(),
  includeExtensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'],
  includeDirs: ['app', 'lib', 'components', 'utils', 'hooks', 'types', 'styles'],
  includeRootFiles: [
    'package.json',
    'tsconfig.json',
    'tailwind.config.ts',
    'tailwind.config.js',
    'next.config.js',
    'next.config.mjs',
    '.env.example',
    'drizzle.config.ts',
    'auth.ts',
    'auth.config.ts',
    'middleware.ts',
    'README.md'
  ],
  excludeDirs: [
    'node_modules',
    '.next',
    '.git',
    'dist',
    'build',
    'coverage',
    '.vercel',
    'out',
    'public',
    '.turbo',
    'drizzle',
    'scripts' // Exclude scripts directory
  ],
  excludeFiles: [
    '.env',
    '.env.local',
    '.env.production',
    '.env.development',
    'package-lock.json',
    'yarn.lock',
    'pnpm-lock.yaml',
    '.DS_Store',
    OUTPUT_FILE, // Use the constant instead
    'consolidate-code.ts', // Exclude this script
    'consolidate-code.js' // In case there's a JS version
  ]
};

function shouldIncludeFile(filePath: string): boolean {
  const basename = path.basename(filePath);
  const ext = path.extname(filePath);
  
  // Exclude the output file by checking the full path as well
  if (filePath.endsWith(config.outputFile)) {
    return false;
  }
  
  if (config.excludeFiles.includes(basename)) {
    return false;
  }
  
  if (config.includeRootFiles.includes(basename)) {
    return true;
  }
  
  return config.includeExtensions.includes(ext);
}

function shouldScanDirectory(dirPath: string): boolean {
  const dirname = path.basename(dirPath);
  return !config.excludeDirs.includes(dirname);
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (shouldScanDirectory(filePath)) {
        const relativePath = path.relative(config.rootDir, filePath);
        const topLevelDir = relativePath.split(path.sep)[0];
        
        if (dirPath === config.rootDir || config.includeDirs.includes(topLevelDir)) {
          arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        }
      }
    } else {
      if (shouldIncludeFile(filePath)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

function consolidateCode(): void {
  console.log('Starting code consolidation...\n');
  
  let output = '';
  let fileCount = 0;
  
  const allFiles = getAllFiles(config.rootDir);
  allFiles.sort();
  
  allFiles.forEach((filePath) => {
    try {
      const relativePath = path.relative(config.rootDir, filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      
      output += `/${relativePath.replace(/\\/g, '/')}\n\n`;
      output += content;
      output += '\n\n\n';
      
      fileCount++;
      console.log(`✓ ${relativePath}`);
    } catch (error) {
      console.error(`✗ Error reading ${filePath}: ${(error as Error).message}`);
    }
  });
  
  fs.writeFileSync(config.outputFile, output);
  
  console.log(`\n✨ Consolidation complete!`);
  console.log(`📄 ${fileCount} files written to ${config.outputFile}`);
  console.log(`📦 File size: ${(fs.statSync(config.outputFile).size / 1024 / 1024).toFixed(2)} MB`);
}

// Run the consolidation
consolidateCode();