import * as vscode from 'vscode';
import { generateShortcutCommand } from './commands/generateShortcut';
import { initLocalization } from './utils/localize';

export function activate(context: vscode.ExtensionContext) {
    initLocalization(context.extensionPath);
    
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('shortcut-configurator.language')) {
                initLocalization(context.extensionPath);
            }
        })
    );

    console.log('Shortcut Configurator Active');
    let disposable = vscode.commands.registerCommand('shortcut-configurator.generateShortcut', () => {
        generateShortcutCommand(context);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
