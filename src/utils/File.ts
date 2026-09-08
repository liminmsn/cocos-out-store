import fs from "node:fs/promises";
import path from "node:path";

/**是不是文件 */
async function isFile(filePath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(filePath);
        return stat.isFile();
    } catch {
        return false;
    }
}
/**是不是目录 */
async function isDirectory(filePath: string): Promise<boolean> {
    try {
        const stat = await fs.stat(filePath);
        return stat.isDirectory();
    } catch {
        return false;
    }
}
/**是否存在 */
async function isDirOrFile(name: string) {
    return await isDirectory(name) || await isFile(name);
}
/**读取配置文件 */
async function loadConfig(projectPath: string): Promise<CocosBuild.Config> {
    const configPath = path.join(projectPath, "cocos-build.json");
    const content = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(content);
    return config;
}

export { isFile, isDirectory, isDirOrFile, loadConfig };