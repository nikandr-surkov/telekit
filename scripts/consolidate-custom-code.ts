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
    codeTargets: string[]; // Files or folders to include code from
}

interface FileNode {
    name: string;
    type: 'file' | 'directory';
    path: string;
    children?: FileNode[];
}

const OUTPUT_FILE = 'selected-code.txt';

const config: Config = {
    outputFile: OUTPUT_FILE,
    rootDir: process.cwd(),
    includeExtensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'],
    includeDirs: ['app', 'lib', 'components', 'utils', 'hooks', 'types', 'styles', 'github-viewer'],
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
        'consolidate-code.js',
        'extract-code.ts',
        'extract-code.js'
    ],
    // SPECIFY YOUR TARGET FILES/FOLDERS HERE
    codeTargets: [
        'app/(main)/product',
        // 'app/api',
        'components/products',
        // 'components/ui',
        'lib/db',
        // 'app/(admin)/admin',
        // 'lib/validation',
        // 'app/api/admin',
        // 'components',
        'app/globals.css',
        // 'app/(main)/product/[slug]/page.tsx',
        // 'components/products/ProductContentRenderer.tsx',
        // 'github-viewer'
    ]
};

function shouldIncludeInTree(filePath: string): boolean {
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

function shouldIncludeCode(filePath: string): boolean {
    const relativePath = path.relative(config.rootDir, filePath).replace(/\\/g, '/');

    // Check if this file or any of its parent directories are in codeTargets
    for (const target of config.codeTargets) {
        // Normalize target path
        const normalizedTarget = target.replace(/\\/g, '/');

        // Exact match
        if (relativePath === normalizedTarget) {
            return true;
        }

        // Check if file is inside a target directory
        if (relativePath.startsWith(normalizedTarget + '/')) {
            return true;
        }
    }

    return false;
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
        path: dirPath,
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
                if (shouldIncludeInTree(filePath)) {
                    node.children!.push({
                        name: file,
                        type: 'file',
                        path: filePath
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
        const relativePath = path.relative(config.rootDir, node.path).replace(/\\/g, '/');
        const includesCode = shouldIncludeCode(node.path);
        const highlight = includesCode ? ' ✨' : '';

        output += prefix + connector + icon + node.name + highlight + '\n';
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

function getAllCodeFiles(node: FileNode, arrayOfFiles: string[] = []): string[] {
    if (node.type === 'file') {
        if (shouldIncludeCode(node.path)) {
            arrayOfFiles.push(node.path);
        }
    } else if (node.children) {
        node.children.forEach(child => {
            getAllCodeFiles(child, arrayOfFiles);
        });
    }

    return arrayOfFiles;
}

function consolidateCode(): void {
    console.log('Starting selective code extraction...\n');
    console.log('Code targets:');
    config.codeTargets.forEach(target => console.log(`  - ${target}`));
    console.log('');

    // Build the file tree
    console.log('Building project structure...');
    const fileTree = buildFileTree(config.rootDir, true);

    if (!fileTree) {
        console.error('Failed to build file tree');
        return;
    }

    const treeOutput = renderTree(fileTree);

    // Get all files that should have their code included
    const codeFiles = getAllCodeFiles(fileTree);
    codeFiles.sort();

    let output = '# Project Structure\n\n';
    output += 'Files marked with ✨ have their code included below.\n\n';
    output += '```\n';
    output += treeOutput;
    output += '```\n\n';

    if (codeFiles.length > 0) {
        output += '# Code Files\n\n';

        let fileCount = 0;

        codeFiles.forEach((filePath) => {
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

        console.log(`\n✨ Extraction complete!`);
        console.log(`📄 ${fileCount} files written to ${config.outputFile}`);
    } else {
        output += '# No Code Files\n\n';
        output += 'No files matched the specified targets.\n';
        console.log('\n⚠️  No files matched the specified targets.');
    }

    fs.writeFileSync(config.outputFile, output);
    console.log(`📦 File size: ${(fs.statSync(config.outputFile).size / 1024 / 1024).toFixed(2)} MB`);
}

// Run the consolidation
consolidateCode();