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

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileNode[];
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
    'scripts'
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
    OUTPUT_FILE,
    'consolidate-code.ts',
    'consolidate-code.js'
  ]
};

function shouldIncludeFile(filePath: string): boolean {
  const basename = path.basename(filePath);
  const ext = path.extname(filePath);
  
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

function shouldIncludeDirectory(dirPath: string): boolean {
  const relativePath = path.relative(config.rootDir, dirPath);
  const topLevelDir = relativePath.split(path.sep)[0];
  
  return dirPath === config.rootDir || config.includeDirs.includes(topLevelDir);
}

function buildFileTree(dirPath: string, isRoot: boolean = false): FileNode | null {
  const dirname = path.basename(dirPath);
  
  if (!isRoot && !shouldScanDirectory(dirPath)) {
    return null;
  }
  
  if (!isRoot && !shouldIncludeDirectory(dirPath)) {
    return null;
  }
  
  const node: FileNode = {
    name: isRoot ? path.basename(config.rootDir) : dirname,
    type: 'directory',
    children: []
  };
  
  try {
    const files = fs.readdirSync(dirPath);
    
    files.forEach((file) => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        const childNode = buildFileTree(filePath);
        if (childNode && childNode.children && childNode.children.length > 0) {
          node.children!.push(childNode);
        }
      } else {
        if (shouldIncludeFile(filePath)) {
          node.children!.push({
            name: file,
            type: 'file'
          });
        }
      }
    });
    
    // Sort children: directories first, then files, both alphabetically
    node.children!.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });
    
  } catch (error) {
    console.error(`Error reading directory ${dirPath}: ${(error as Error).message}`);
  }
  
  return node;
}

function renderTree(node: FileNode, prefix: string = '', isLast: boolean = true, isRoot: boolean = true): string {
  let output = '';
  
  if (!isRoot) {
    const connector = isLast ? '└── ' : '├── ';
    const icon = node.type === 'directory' ? '📁 ' : '📄 ';
    output += prefix + connector + icon + node.name + '\n';
  }
  
  if (node.children) {
    const newPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ');
    
    node.children.forEach((child, index) => {
      const isLastChild = index === node.children!.length - 1;
      output += renderTree(child, newPrefix, isLastChild, false);
    });
  }
  
  return output;
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
  
  // Build the file tree
  console.log('Building project structure...');
  const fileTree = buildFileTree(config.rootDir, true);
  const treeOutput = fileTree ? renderTree(fileTree) : '';
  
  let output = '# Project Structure\n\n';
  output += '```\n';
  output += treeOutput;
  output += '```\n\n';
  output += '# Code Files\n\n';
  
  let fileCount = 0;
  
  const allFiles = getAllFiles(config.rootDir);
  allFiles.sort();
  
  allFiles.forEach((filePath) => {
    try {
      const relativePath = path.relative(config.rootDir, filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      
      output += `## /${relativePath.replace(/\\/g, '/')}\n\n`;
      output += '```' + path.extname(filePath).slice(1) + '\n';
      output += content;
      output += '\n```\n\n';
      
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