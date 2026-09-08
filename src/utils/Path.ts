import fs from "node:fs/promises";
import path from "node:path";

async function exists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function getFilePath(name: string) {
    return path.join(process.cwd(), name);
}

function getFilesPath(names: string[]) {
    return names.map(name => getFilePath(name));
}

export { exists, getFilePath, getFilesPath };