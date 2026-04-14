import { IShortcutGenerator, ShortcutOptions } from '../models/IShortcutGenerator';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { localize } from '../utils/localize';

export class LinuxGenerator implements IShortcutGenerator {
    async generate(options: ShortcutOptions): Promise<void> {
        const desktopFilesDir = path.join(os.homedir(), '.local', 'share', 'applications');

        if (!fs.existsSync(desktopFilesDir)) {
            fs.mkdirSync(desktopFilesDir, { recursive: true });
        }

        const safeWorkspaceName = options.workspaceName.replace(/[\/\\?%*:|"<>]/g, '-').trim();
        const desktopFilePath = path.join(desktopFilesDir, `vscode-workspace-${safeWorkspaceName}.desktop`);

        const escapeBashString = (str: string) => str.replace(/'/g, "'\\''");
        const escapedWorkspacePath = escapeBashString(options.workspacePath);

        let actionsList = '';
        let actionsBlocks = '';

        if (options.quickActions && options.quickActions.length > 0) {
            const actionNames = options.quickActions.map((_, i) => `Action${i}`).join(';');
            actionsList = `Actions=${actionNames};\n`;

            for (let i = 0; i < options.quickActions.length; i++) {
                const action = options.quickActions[i];
                const safeActionName = `Action${i}`;
                const escapedScript = escapeBashString(action.script || action.name);
                const escapedCwd = escapeBashString(action.cwd || options.workspacePath);

                // Creates a smart wrapper that tries to find a terminal and execute the command inside it
                const execLine = `env SC_CWD='${escapedCwd}' SC_CMD='${action.packageManager} run '\\''${escapedScript}'\\''' bash -i -c "export SC_CWD SC_CMD; for t in x-terminal-emulator gnome-terminal konsole xfce4-terminal mate-terminal lxterminal terminator xterm; do if command -v \\$t >/dev/null 2>&1; then if [ \\"\\$t\\" = \\"gnome-terminal\\" ] || [ \\"\\$t\\" = \\"mate-terminal\\" ]; then exec \\$t -- bash -i -c 'cd \\"\\$SC_CWD\\" && eval \\"\\$SC_CMD\\"; exec bash'; else exec \\$t -e bash -i -c 'cd \\"\\$SC_CWD\\" && eval \\"\\$SC_CMD\\"; exec bash'; fi; fi; done"`;

                actionsBlocks += `
[Desktop Action ${safeActionName}]
Name=${localize('msg.runScriptLinux', action.name)}
Exec=${execLine}
Terminal=false
`;
            }
        }

        const desktopFileContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=${options.workspaceName}
Comment=VS Code Workspace Shortcut
Exec="${options.execPath}" "${options.workspacePath}"
Icon=${options.iconPath}
Terminal=false
Categories=Development;IDE;
${actionsList}
${actionsBlocks}
`;

        fs.writeFileSync(desktopFilePath, desktopFileContent, { mode: 0o755 });
    }
}
