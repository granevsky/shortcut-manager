import * as vscode from 'vscode';
import { getWorkspaceInfo, parseAllPackageJsonScripts, detectPackageManager } from '../utils/workspaceUtils';
import { resolveIcon } from '../utils/iconUtils';
import { GeneratorFactory } from '../generators/GeneratorFactory';
import { QuickAction } from '../models/IShortcutGenerator';
import { localize } from '../utils/localize';

export async function generateShortcutCommand(context: vscode.ExtensionContext) {
    if (!vscode.workspace.isTrusted) {
        vscode.window.showErrorMessage(localize('msg.requiresTrustedWorkspace'));
        return;
    }

    try {
        const { name, fsPath } = getWorkspaceInfo();
        const scripts = await parseAllPackageJsonScripts(fsPath);

        let selectedActions: QuickAction[] = [];

        if (scripts.length > 0) {
            scripts.sort((a, b) => {
                if (a.relativePath === 'root' && b.relativePath !== 'root') {
                    return -1;
                }
                if (a.relativePath !== 'root' && b.relativePath === 'root') {
                    return 1;
                }
                return a.name.localeCompare(b.name);
            });

            const picks = scripts.map(s => ({ 
                label: s.name, 
                description: s.cwd,
                rawScript: s.script,
                rawCwd: s.cwd
            }));
            const selectedPicks = await vscode.window.showQuickPick(picks, {
                canPickMany: true,
                placeHolder: localize('msg.selectScriptsPlaceholder'),
            });

            if (selectedPicks) {
                selectedActions = selectedPicks.map(pick => {
                    const cwd = (pick as any).rawCwd as string;
                    return {
                        name: pick.label,
                        script: (pick as any).rawScript,
                        cwd: cwd,
                        packageManager: detectPackageManager(cwd)
                    };
                });
            }
        }

        const iconPath = resolveIcon(fsPath, context.extensionPath);
        const generator = GeneratorFactory.getGenerator();

        await generator.generate({
            workspaceName: name,
            workspacePath: fsPath,
            iconPath,
            quickActions: selectedActions,
            uriScheme: vscode.env.uriScheme,
            execPath: process.execPath
        });

        vscode.window.showInformationMessage(localize('msg.shortcutGeneratedSuccess'));
    } catch (error: any) {
        vscode.window.showErrorMessage(localize('msg.shortcutGeneratedFailed', error.message));
    }
}
