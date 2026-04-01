export interface QuickAction {
    name: string;
    script: string;
    cwd: string;
    packageManager: string;
}

export interface ShortcutOptions {
    workspaceName: string;
    workspacePath: string;
    iconPath: string;
    quickActions: QuickAction[];
    uriScheme: string;
    execPath: string;
}

export interface IShortcutGenerator {
    generate(options: ShortcutOptions): Promise<void>;
}
