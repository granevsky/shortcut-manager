import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { localize } from './localize';

export function getWorkspaceInfo() {
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        throw new Error(localize('msg.noWorkspaceFolder'));
    }

    const name = vscode.workspace.name || 'Workspace';
    const fsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    return { name, fsPath };
}

export interface PackageScript {
    name: string;
    script: string;
    cwd: string;
    relativePath: string;
}

export async function parseAllPackageJsonScripts(workspacePath: string): Promise<PackageScript[]> {
    const scripts: PackageScript[] = [];
    
    // Find all package.json files excluding node_modules
    const files = await vscode.workspace.findFiles('**/package.json', '**/node_modules/**');
    
    for (const file of files) {
        try {
            const content = fs.readFileSync(file.fsPath, 'utf8');
            const json = JSON.parse(content);
            if (json.scripts && typeof json.scripts === 'object' && !Array.isArray(json.scripts)) {
                const cwd = path.dirname(file.fsPath);
                let relativeDir = path.relative(workspacePath, cwd);
                if (relativeDir === '') {
                    relativeDir = 'root';
                }
                
                for (const scriptName of Object.keys(json.scripts)) {
                    const label = relativeDir === 'root' ? scriptName : `${relativeDir} : ${scriptName}`;
                    scripts.push({
                        name: label,
                        script: scriptName,
                        cwd: cwd,
                        relativePath: relativeDir
                    });
                }
            }
        } catch (error) {
            console.error(`${localize('msg.failedToParsePackageJson')} ${error}`);
        }
    }
    return scripts;
}

export function detectPackageManager(cwd: string): string {
    const config = vscode.workspace.getConfiguration('shortcut-configurator');
    const override = config.get<string>('packageManager');

    if (override && override !== 'auto') {
        return override;
    }

    if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
        return 'pnpm';
    }
    if (fs.existsSync(path.join(cwd, 'yarn.lock'))) {
        return 'yarn';
    }
    if (fs.existsSync(path.join(cwd, 'bun.lockb'))) {
        return 'bun';
    }
    
    // Default fallback
    return 'npm';
}
