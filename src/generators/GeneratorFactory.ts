import { IShortcutGenerator } from '../models/IShortcutGenerator';
import { LinuxGenerator } from './LinuxGenerator';
import { WindowsGenerator } from './WindowsGenerator';
import { MacGenerator } from './MacGenerator';

export class GeneratorFactory {
    static getGenerator(): IShortcutGenerator {
        switch (process.platform) {
            case 'linux':
                return new LinuxGenerator();
            case 'win32':
                return new WindowsGenerator();
            case 'darwin':
                return new MacGenerator();
            default:
                throw new Error(`Unsupported platform: ${process.platform}`);
        }
    }
}
