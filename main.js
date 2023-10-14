/*This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.
  This Source Code Form is "Incompatible With Secondary Licenses", as
  defined by the Mozilla Public License, v. 2.0.*/
import "npm:love-of-my-life";
import "./libraries/codColors.js";
import {
    is,
    to
} from "./libraries/isto/index.js";

import {
    resolve as resolvePath,
    join as joinPath,
    dirname,
    SEP
} from "path";

try {
    let path = Deno.args[0];
    let current;
    if (is.string(path) == true) {
        path = resolvePath(path);
        current = Deno.args.map(arg => arg?.toLowerCase()).includes("--fcwd") == true ? Deno.cwd() : dirname(Deno.execPath());
    } else {
        path = resolvePath(Deno.build.os == "windows" ? "C:\\Program Files (x86)\\Steam" : Deno.build.os == "darwin" ? "~/Library/Application Support/Steam" : "~/.steam/steam");
        current = Deno.cwd();
    };
    if ((await Deno.permissions.request({
            name: "read",
            path: current
        })).state == "granted") {
        if ((await Deno.permissions.request({
                name: "write",
                path: current
            })).state == "granted") {
            if ((await Deno.permissions.request({
                    name: "read",
                    path
                })).state == "granted") {
                if ((await Deno.lstat(path)).isDirectory == true) {
                    const workshop = resolvePath(joinPath(path, (["windows", "darwin"].includes(Deno.build.os) != true ? "SteamApps" : "steamapps"), "workshop", "content", "311210"));
                    if ((await Deno.lstat(workshop)).isDirectory == true) {
                        for await (const entry of Deno.readDir(workshop)) {
                            if (entry.isDirectory == true) {
                                const messageSeparator = "^4-->^R";
                                entry.path = resolvePath(joinPath(workshop, entry.name));
                                await Deno.readTextFile(resolvePath(joinPath(entry.path, "workshop.json"))).then(async data => {
                                    data = to.object(data);
                                    let Type = data["Type"];
                                    const FolderName = data["FolderName"];
                                    const Title = data["Title"];
                                    const modType = (is.string(Type) == true ? (Type = Type.toLowerCase()) == "map" : false) == true ? "usermaps" : "mods";
                                    const [modName, modNameLog] = is.string(FolderName) == true ? [FolderName, `^6${FolderName}^R`] : [entry.name, entry.name];
                                    const modTitleFail = is.string(Title) == true ? `${Title}[${modNameLog}]` : modNameLog;
                                    const modTitleSuccess = is.string(Title) == true ? Title : modNameLog;
                                    let modPath = resolvePath(joinPath(current, modType, modName));
                                    return await Deno.lstat(modPath).then(async info => {
                                        if (info.isDirectory == true) {
                                            try {
                                                modPath = resolvePath(joinPath(current, modType, entry.name));
                                                const {
                                                    isSymlink
                                                } = await Deno.lstat(resolvePath(joinPath(modPath, "zone")));
                                                if (isSymlink == true) return console.info(`^B✅ ${is.string(Title) == true ? Title : entry.name} ${messageSeparator} ^B^U${modType}${SEP}${entry.name}`);
                                                else return await Deno.remove(modPath).then(() => {
                                                    throw false;
                                                }).catch(error => {
                                                    throw error;
                                                });
                                            } catch (_error) {
                                                return await Deno.mkdir(modPath, {
                                                    recursive: true
                                                }).then(async () => await Deno.symlink(entry.path, resolvePath(joinPath(modPath, "zone")), {
                                                    type: "dir"
                                                }).then(() => console.info(`🔄 ${is.string(Title) == true ? Title : entry.name} ${messageSeparator} ^2${modType}${SEP}${entry.name}`)).catch(async () => await Deno.remove(modPath).then(() => console.error(`❌ ${is.string(Title) == true ? `${Title}[${entry.name}]` : entry.name} ${messageSeparator} ^1^BUnable to create a symbolic link from the Workshop Content path to the Content path.`)).catch(() => console.error(`❌ ${is.string(Title) == true ? `${Title}[${entry.name}]` : entry.name} ${messageSeparator} ^1^BUnable to remove the Content path.`)))).catch(() => console.error(`❌ ${is.string(Title) == true ? `${Title}[${entry.name}]` : entry.name} ${messageSeparator} ^1^BUnable to create the Content path.`));
                                            };
                                        } else return await Deno.remove(modPath).then(async () => await Deno.mkdir(modPath, {
                                            recursive: true
                                        }).then(async () => await Deno.symlink(entry.path, resolvePath(joinPath(modPath, "zone")), {
                                            type: "dir"
                                        }).then(() => console.info(`🔄 ${modTitleSuccess} ${messageSeparator} ^2${modType}${SEP}${modNameLog}`)).catch(async () => await Deno.remove(modPath).then(() => console.error(`❌ ${modTitleFail} ${messageSeparator} ^1^BUnable to create a symbolic link from the Workshop Content path to the Content path.`)).catch(() => console.error(`❌ ${modTitleFail} ${messageSeparator} ^1^BUnable to remove the Content path.`)))).catch(() => console.error(`❌ ${modTitleFail} ${messageSeparator} ^1^BUnable to create the Content path.`))).catch(() => console.error(`❌ ${modTitleFail} ${messageSeparator} ^1^BUnable to remove the invalid Content path.`));
                                    }).catch(async () => await Deno.mkdir(modPath, {
                                        recursive: true
                                    }).then(async () => await Deno.symlink(entry.path, resolvePath(joinPath(modPath, "zone")), {
                                        type: "dir"
                                    }).then(() => console.info(`🔄 ${modTitleSuccess} ${messageSeparator} ^2${modType}${SEP}${modNameLog}`)).catch(async () => await Deno.remove(modPath).then(() => console.error(`❌ ${modTitleFail} ${messageSeparator} ^1^BUnable to create a symbolic link from the Workshop Content path to the Content path.`)).catch(() => console.error(`❌ ${modTitleFail} ${messageSeparator} ^1^BUnable to remove the Content path.`)))).catch(() => console.error(`❌ ${modTitleFail} ${messageSeparator} ^1^BUnable to create the Content path.`)));
                                }).catch(async () => {
                                    const modPath = resolvePath(joinPath(current, "mods", entry.name));
                                    console.warn(`⚠️ ${entry.name} ${messageSeparator} ^3Unable to read the workshop.json from Workshop Content path.`);
                                    return await Deno.lstat(modPath).then(async info => {
                                        try {
                                            if (info.isDirectory == true) {
                                                const {
                                                    isSymlink
                                                } = await Deno.lstat(resolvePath(joinPath(modPath, "zone")));
                                                if (isSymlink == true) return console.info(`^B✅ ${entry.name} ${messageSeparator} ^B^Umods${SEP}${entry.name}`);
                                                else throw true;
                                            } else throw false;
                                        } catch (error) {
                                            return await Deno.remove(modPath).then(async () => await Deno.mkdir(modPath, {
                                                recursive: true
                                            }).then(async () => await Deno.symlink(entry.path, resolvePath(joinPath(modPath, "zone")), {
                                                type: "dir"
                                            }).then(() => console.info(`🔄 ^2mods${SEP}${entry.name}`)).catch(async () => await Deno.remove(modPath).then(() => console.error(`❌ ${entry.name} ${messageSeparator} ^1^BUnable to create a symbolic link from the Workshop Content path to the Content path.`)).catch(() => console.error(`❌ ${entry.name} ${messageSeparator} ^1^BUnable to remove the Content path.`)))).catch(() => console.error(`❌ ${entry.name} ${messageSeparator} ^1^BUnable to create the Content path.`))).catch(() => console.error(`❌ ${entry.name} ${messageSeparator} ^1^BUnable to remove the ${error != true ? "invalid " : ""}Content path.`));
                                        };
                                    }).catch(async () => await Deno.mkdir(modPath, {
                                        recursive: true
                                    }).then(async () => await Deno.symlink(entry.path, resolvePath(joinPath(modPath, "zone")), {
                                        type: "dir"
                                    }).then(() => console.info(`🔄 ^2mods${SEP}${entry.name}`)).catch(async () => await Deno.remove(modPath).then(() => console.error(`❌ ${entry.name} ${messageSeparator} ^1^BUnable to create a symbolic link from the Workshop Content path to the Content path.`)).catch(() => console.error(`❌ ${entry.name} ${messageSeparator} ^1^BUnable to remove the Content path.`)))).catch(() => console.error(`❌ ${entry.name} ${messageSeparator} ^1^BUnable to create the Content path.`)));
                                });
                            };
                        };
                    } else throw new Error("The Workshop path from Drag and Drop path (^4Steam Library path^1) is not a folder.");
                } else throw new Error("The Drag and Drop path (^4Steam Library path^1) is not a folder.");
            } else throw new Error("The Drag and Drop path (^4Steam Library path^1) is not readable.");
        } else throw new Error("The current path (^4BO3 path^1) is not writable.");
    } else throw new Error("The current path (^4BO3 path^1) is not readable");
} catch (error) {
    typeof (error?.toString) == "function" ? console.error("^1^B❌", error.toString()) : console.error("^1^B❌ " + error);
} finally {
    if (Deno.args.map(arg => arg?.toLowerCase()).includes("--nopause") != true) {
        Deno.write(Deno.stdout.rid, new TextEncoder().encode("Press any key to exit."));
        Deno.stdin.setRaw(true);
        await Deno.stdin.read(new Uint8Array(1));
    };
};