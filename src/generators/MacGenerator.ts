import { IShortcutGenerator, ShortcutOptions } from '../models/IShortcutGenerator';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as cp from 'child_process';
import { promisify } from 'util';

const execFile = promisify(cp.execFile);

export class MacGenerator implements IShortcutGenerator {
    async generate(options: ShortcutOptions): Promise<void> {
        const applicationsDir = path.join(os.homedir(), 'Applications');

        if (!fs.existsSync(applicationsDir)) {
            fs.mkdirSync(applicationsDir, { recursive: true });
        }

        const safeWorkspaceName = options.workspaceName.replace(/[:\/\\?%*|"<>]/g, '-').trim();
        
        // --- 1. Main Workspace App ---
        let appName = 'Visual Studio Code';
        let codeCliPath = "code"; 
        const appBundleMatch = options.execPath.match(/^(.*\.app)\//);
        if (appBundleMatch && appBundleMatch[1]) {
            appName = path.basename(appBundleMatch[1], '.app');
            const binDir = path.join(appBundleMatch[1], 'Contents', 'Resources', 'app', 'bin');
            if (fs.existsSync(binDir)) {
                const files = fs.readdirSync(binDir);
                for (const file of files) {
                    // Ignore .cmd or other weird extensions, grab the bash native CLI helper 'code'
                    if (!file.includes('.')) {
                        codeCliPath = path.join(binDir, file);
                        break;
                    }
                }
            }
        }

        const escapeAppleScriptString = (str: string) => str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
        
        const appBundlePath = path.join(applicationsDir, `${safeWorkspaceName}.app`);
        const escapeBashQuote = (str: string) => str.replace(/'/g, "'\\''");
        
        // We use Apple's native osacompile to securely generate the Workspace Launcher Applet.
        // We route the execution through Terminal.app (exactly like Quick Actions).
        // Terminal has full TCC permissions and survives macOS Launchpad GUI limitations.
        const terminalCommand = `cd '${escapeBashQuote(options.workspacePath)}' && '${escapeBashQuote(codeCliPath)}' . && exit`;
        const asScriptLine1 = `tell application "Terminal" to do script "${escapeAppleScriptString(terminalCommand)}"`;
        const asScriptLine2 = `tell application "Terminal" to activate`;
        
        // Delete existing app to prevent LaunchServices caching issues and Gatekeeper blocks on unsigned modified binaries
        if (fs.existsSync(appBundlePath)) {
            fs.rmSync(appBundlePath, { recursive: true, force: true });
        }

        await execFile('osacompile', ['-o', appBundlePath, '-e', asScriptLine1, '-e', asScriptLine2]);

        if (fs.existsSync(options.iconPath)) {
            const actResourcesDirPath = path.join(appBundlePath, 'Contents', 'Resources');
            fs.copyFileSync(options.iconPath, path.join(actResourcesDirPath, 'applet.icns'));
        }

        if (options.quickActions && options.quickActions.length > 0) {
            for (const action of options.quickActions) {
                const actionNameSafe = action.name.replace(/[:\/\\?%*|"<>]/g, '-').trim();
                const actionBundlePath = path.join(applicationsDir, `${safeWorkspaceName} - ${actionNameSafe}.app`);
                
                if (fs.existsSync(actionBundlePath)) {
                    fs.rmSync(actionBundlePath, { recursive: true, force: true });
                }

                const terminalCommand = `cd '${escapeBashQuote(action.cwd || options.workspacePath)}' && ${action.packageManager} run '${escapeBashQuote(action.script || action.name)}'`;
                const actionScriptLine1 = `tell application "Terminal" to do script "${escapeAppleScriptString(terminalCommand)}"`;
                const actionScriptLine2 = `tell application "Terminal" to activate`;

                await execFile('osacompile', [
                    '-o', actionBundlePath, 
                    '-e', actionScriptLine1, 
                    '-e', actionScriptLine2
                ]);

                if (fs.existsSync(options.iconPath)) {
                    const actResourcesDirPath = path.join(actionBundlePath, 'Contents', 'Resources');
                    fs.copyFileSync(options.iconPath, path.join(actResourcesDirPath, 'applet.icns'));
                }
            }
        }
    }
}
