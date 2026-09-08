#!/usr/bin/env node
import pkg from "../package.json"
import path from "node:path";
import fs from "node:fs/promises";
import { argv } from "node:process";
import chalk from "chalk";
import ora from "ora";
import { exists, getFilePath } from "./utils/Path";
import { isDirectory, isDirOrFile, isFile, loadConfig } from "./utils/File";
const args = argv.slice(2);
const projectPath = process.cwd();

switch (true) {
    case args.includes("-init"):
        await initConfig();
        break;
    case args.includes("-c"):
        console.log(`
{
    include: [
        "assets",
        "settings",
        "project.json",
        "package.json"
    ]
}`);
        break;
    case args.includes("-b"):
        await build();
        break;
    case args.includes("-v"):
        console.log(chalk.green("version:"), pkg.version);
        break;
    default:
        showHelp();
        break;
}

/** 初始化 cocos-build.json */
async function initConfig() {
    const config = {
        include: []
    };
    const configPath = path.join(projectPath, "cocos-build.json");
    if (await exists(configPath)) {
        console.log(chalk.yellow("当前项目已经存在"), "cocos-build.json");
        return;
    }
    await fs.writeFile(configPath, JSON.stringify(config, null, 4), "utf-8");
    console.log(chalk.green("已为当前项目创建"), "cocos-build.json");
}

/** 帮助 */
function showHelp() {
    console.log(`
${chalk.bold.cyan("╭──────────────────────────────────────────────╮")}
${chalk.bold.cyan("│")}  ${chalk.bold.white("Cocos Store")} ${chalk.gray("发布包 CLI")}
${chalk.bold.cyan("│")}  ${chalk.gray("Cocos Creator 3.x Store 发布工具")}
${chalk.bold.cyan("╰──────────────────────────────────────────────╯")}

${chalk.bold.white("用法")}
${chalk.green("$")} cocos-build ${chalk.yellow("<command>")}

${chalk.bold.white("命令")}
${chalk.yellow("-init")}    ${chalk.gray("初始化 cocos-build.json 配置文件")}
${chalk.yellow("-c")}       ${chalk.gray("查看默认包含内容配置")}
${chalk.yellow("-b")}       ${chalk.gray("构建 Cocos Store 发布包")}
${chalk.yellow("-v")}       ${chalk.gray("显示 CLI 当前版本")}
${chalk.yellow("-h")}       ${chalk.gray("显示帮助信息")}

${chalk.bold.white("示例")}
${chalk.green("$")} cocos-build -init
${chalk.green("$")} cocos-build -c
${chalk.green("$")} cocos-build -b
${chalk.green("$")} cocos-build -v
${chalk.green("$")} cocos-build -h

${chalk.bold.white("配置")}
${chalk.gray("项目根目录下的 cocos-build.json 用于配置发布包内容。")}
${chalk.gray("默认不修改，需要而外包含官方包含内容再添加")}
${chalk.gray("Cocos Store Build CLI · ")}${chalk.green(pkg.version)}`);
}

/**打包 */
async function build() {
    const configPath = path.join(projectPath, "cocos-build.json");
    if (!(await exists(configPath))) {
        console.log(chalk.red("cocos-build.json File Error!"), "帮助请使用 cocos-build -h");
        process.exitCode = 1;
        return;
    }

    const config_default = {
        include: [
            "assets",
            "settings",
            "project.json",
            "package.json"
        ]
    };
    const spinner = ora("正在扫描项目...").start();
    try {
        spinner.text = "正在检查项目文件...";
        const files: string[] = [];
        // cli默认包含及脚本
        config_default.include.filter(async item => {
            if (await isDirOrFile(item)) {
                files.push(getFilePath(item));
            }
        });
        // 用户定义包含文件
        const include = (await loadConfig(projectPath)).include;
        include.filter(async item => {
            if (await isDirOrFile(item)) {
                files.push(getFilePath(item));
            } else {
                console.log("你包含的", chalk.yellow(item), "资源不存在");
            }
        });
        spinner.text = "项目检查完成";
        // console.log(files);
        await sleep(500);
        spinner.text = "正在构建...";
        await runCocosBuild(files);
        spinner.succeed("构建完成");
    } catch (error) {
        spinner.fail("构建失败");
        throw error;
    }
}
async function runCocosBuild(files: string[]) {
    const buildPath = path.join(projectPath, "build_store");
    await fs.mkdir(buildPath, { recursive: true });
    for (const file of files) {
        const sourcePath = path.resolve(projectPath, file);
        // 保留原来的相对目录结构
        const relativePath = path.relative(projectPath, sourcePath);
        const targetPath = path.join(buildPath, relativePath);
        const stat = await fs.stat(sourcePath);
        if (stat.isDirectory()) {
            await fs.cp(sourcePath, targetPath, {
                recursive: true,
                force: true
            });

            console.log("复制目录:", relativePath);
        } else if (stat.isFile()) {
            await fs.mkdir(
                path.dirname(targetPath),
                {
                    recursive: true
                }
            );
            await fs.copyFile(
                sourcePath,
                targetPath
            );
            console.log("复制文件:", relativePath);
        }
    }
    console.log("构建文件复制完成");
}
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}