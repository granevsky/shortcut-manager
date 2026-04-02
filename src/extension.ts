import * as vscode from 'vscode';
import { generateShortcutCommand } from './commands/generateShortcut';
import { initLocalization } from './utils/localize';

export function activate(context: vscode.ExtensionContext) {
    initLocalization(context.extensionPath);
    
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('shortcut-manager.language')) {
                initLocalization(context.extensionPath);
            }
        })
    );

    console.log('Shortcut Manager Active');
    let disposable = vscode.commands.registerCommand('shortcut-manager.generateShortcut', () => {
        generateShortcutCommand(context);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

