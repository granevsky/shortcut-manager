import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let nlsData: Record<string, string> = {};

export function initLocalization(extensionPath: string) {
    try {
        const configLang = vscode.workspace.getConfiguration('shortcut-manager').get<string>('language');
        let lang = configLang !== 'auto' ? configLang : vscode.env.language;
        
        // Load default English first
        const defaultNlsPath = path.join(extensionPath, 'package.nls.json');
        if (fs.existsSync(defaultNlsPath)) {
            const content = fs.readFileSync(defaultNlsPath, 'utf8');
            nlsData = { ...JSON.parse(content) };
        }

        // Load specific language and override
        if (lang && lang !== 'en') {
            const nlsFilePath = path.join(extensionPath, `package.nls.${lang}.json`);
            if (fs.existsSync(nlsFilePath)) {
                const content = fs.readFileSync(nlsFilePath, 'utf8');
                const langData = JSON.parse(content);
                nlsData = { ...nlsData, ...langData };
            }
        }
    } catch (e) {
        console.error('Failed to load localization strings:', e);
    }
}

export function localize(key: string, ...args: string[]): string {
    let result = nlsData[key] || key;
    
    // Replace placeholders {0}, {1}, etc.
    args.forEach((arg, index) => {
        result = result.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
    });

    return result;
}

