import * as fs from 'fs';

export function touchDirectories(directories: string[]): void {
    for (const dir of directories) {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
    }
}