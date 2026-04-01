import * as path from 'path';
import * as fs from 'fs';

export function resolveIcon(workspacePath: string, extensionPath: string): string {
    const iconNames = ['favicon', 'logo', 'icon', 'app-icon'];

    const extMap: Record<string, string> = { win32: '.ico', darwin: '.icns' };
    const defaultExt = extMap[process.platform] || '.png';
    const extensionsToCheck = process.platform === 'linux' ? ['.svg', '.png'] : [defaultExt];
    const possibleDirs = [
        workspacePath,
        path.join(workspacePath, 'public'),
        path.join(workspacePath, 'static'),
        path.join(workspacePath, 'assets'),
        path.join(workspacePath, 'src', 'assets')
    ];

    for (const dir of possibleDirs) {
        if (!fs.existsSync(dir)) {
            continue;
        }

        for (const iconName of iconNames) {
            for (const ext of extensionsToCheck) {
                const iconPath = path.join(dir, iconName + ext);
                if (fs.existsSync(iconPath)) {
                    return iconPath;
                }
            }
        }
    }

    return path.join(extensionPath, 'assets', `default${defaultExt}`);
}
