"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.embedSave = exports.readExtractedSave = void 0;
const fs_1 = require("fs");
const bundle_1 = require("./bundle");
const readExtractedSave = (path, options) => {
    const saveFile = readData(path, options);
    saveFile.LuaScript = readScript(path, options);
    saveFile.LuaScriptState = readScriptState(path);
    saveFile.XmlUI = readUi(path);
    saveFile.ObjectStates = readContents(path, options) ?? [];
    return saveFile;
};
exports.readExtractedSave = readExtractedSave;
/**
 * Embeds the content of an previously extracted save file and returns a new save file.
 *
 * @param path The path to an extracted save file.
 * @param options The [[Options]] to use.
 * @returns The embedded save file.
 */
const embedSave = (path, options) => {
    const saveFile = (0, exports.readExtractedSave)(path, options);
    return (0, bundle_1.bundleSave)(saveFile, options);
};
exports.embedSave = embedSave;
const readData = (path, options) => {
    return readJson(path, "Data.json", true);
};
const readObject = (path, options) => {
    const data = readData(path, options);
    data.LuaScript = readScript(path, options);
    data.LuaScriptState = readScriptState(path);
    data.XmlUI = readUi(path);
    if (options.metadataField) {
        const metadata = readMetadata(path);
        if (metadata !== "") {
            data[options.metadataField] = metadata;
        }
    }
    data.ContainedObjects = readContents(path, options);
    data.States = readStates(path, options);
    data.ChildObjects = readChildObjects(path, options);
    return data;
};
const readContents = (path, options) => {
    const contents = readJson(path, "Contents.json");
    if (!contents) {
        return undefined;
    }
    return contents.map((e) => readObject(`${path}/${e.path}`, options));
};
const readStates = (path, options) => {
    const states = readJson(path, "States.json");
    if (!states) {
        return undefined;
    }
    return Object.entries(states).reduce((obj, [id, item]) => {
        return {
            ...obj,
            [id]: readObject(`${path}/${item.path}`, options),
        };
    }, {});
};
const readChildObjects = (path, options) => {
    const children = readJson(path, "Children.json");
    if (!children) {
        return undefined;
    }
    return children.map((e) => readObject(`${path}/${e.path}`, options));
};
const readScript = (path, options) => {
    const ext = options.scriptExtension || "ttslua";
    return readFile(path, `Script.${ext}`);
};
const readScriptState = (path) => {
    return readFile(path, "State.txt");
};
const readUi = (path) => {
    return readFile(path, "UI.xml");
};
const readMetadata = (path) => {
    return readFile(path, "Metadata.toml");
};
const readFile = (path, fileName, required = false) => {
    try {
        return (0, fs_1.readFileSync)(`${path}/${fileName}`, { encoding: "utf-8" });
    }
    catch (e) {
        if (!required && e.code === "ENOENT") {
            return "";
        }
        throw e;
    }
};
const readJson = (path, fileName, required = false) => {
    const content = readFile(path, fileName, required);
    if (content) {
        return JSON.parse(content);
    }
};
//# sourceMappingURL=embed.js.map