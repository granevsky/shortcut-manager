import { IShortcutGenerator, ShortcutOptions } from '../models/IShortcutGenerator';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as cp from 'child_process';
import { promisify } from 'util';
import { localize } from '../utils/localize';
import * as crypto from 'crypto';

const execFile = promisify(cp.execFile);

export class WindowsGenerator implements IShortcutGenerator {
    async generate(options: ShortcutOptions): Promise<void> {
        const startMenuDir = path.join(
            os.homedir(),
            'AppData',
            'Roaming',
            'Microsoft',
            'Windows',
            'Start Menu',
            'Programs'
        );

        const safeWorkspaceName = options.workspaceName.replace(/[\/\\?%*:|"<>]/g, '-').trim();
        
        const workspaceGroupDir = path.join(startMenuDir, safeWorkspaceName);

        if (!fs.existsSync(workspaceGroupDir)) {
            fs.mkdirSync(workspaceGroupDir, { recursive: true });
        }

        const mainShortcutPath = path.join(workspaceGroupDir, `${safeWorkspaceName}.lnk`);

        const escapePsString = (str: string) => str.replace(/"/g, '`"').replace(/\$/g, '`$');
        const escapeSingleQuotePs = (str: string) => str.replace(/'/g, "''");
        
        const escapedWorkspacePath = escapePsString(options.workspacePath);
        const escapedWorkspacePathSq = escapeSingleQuotePs(options.workspacePath);
        const escapedIconPath = escapePsString(options.iconPath);

        let psScript = `$WshShell = New-Object -comObject WScript.Shell\n`;
        
        psScript += `
$Shortcut = $WshShell.CreateShortcut("${escapePsString(mainShortcutPath)}")
$Shortcut.TargetPath = "${escapePsString(options.execPath)}"
$Shortcut.Arguments = "\`"${escapedWorkspacePath}\`""
$Shortcut.WorkingDirectory = "${escapedWorkspacePath}"
$Shortcut.Description = "${escapePsString(localize('msg.openInVsCode', options.workspaceName))}"
$Shortcut.IconLocation = "${escapedIconPath}"
$Shortcut.Save()
`;

        if (options.quickActions && options.quickActions.length > 0) {
            options.quickActions.forEach(action => {
                const actionNameSafe = action.name.replace(/[\/\\?%*:|"<>]/g, '-').trim();
                const actionShortcutPath = path.join(workspaceGroupDir, `${localize('msg.runScript', safeWorkspaceName, actionNameSafe)}.lnk`);
                
                const escapedActionScriptSq = escapeSingleQuotePs(action.script || action.name);
                const escapedCwdSq = escapeSingleQuotePs(action.cwd || options.workspacePath);
                const escapedCwdPs = escapePsString(action.cwd || options.workspacePath);
                
                psScript += `
$ActShortcut = $WshShell.CreateShortcut("${escapePsString(actionShortcutPath)}")
$ActShortcut.TargetPath = "powershell.exe"
$ActShortcut.Arguments = "-NoExit -Command \`"Set-Location -LiteralPath '${escapedCwdSq}'; ${action.packageManager} run '${escapedActionScriptSq}'\`""
$ActShortcut.WorkingDirectory = "${escapedCwdPs}"
$ActShortcut.Description = "${escapePsString(localize('msg.runScript', safeWorkspaceName, action.name))}"
$ActShortcut.IconLocation = "${escapedIconPath}"
$ActShortcut.Save()
`;
            });
        }

        const tempPsPath = path.join(os.tmpdir(), `create_shortcut_${crypto.randomUUID()}.ps1`);
        fs.writeFileSync(tempPsPath, '\uFEFF' + psScript, 'utf8');

        try {
            await execFile('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', tempPsPath]);
        } finally {
            if (fs.existsSync(tempPsPath)) {
                fs.unlinkSync(tempPsPath);
            }
        }
    }
}
