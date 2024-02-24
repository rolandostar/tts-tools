"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeExtractedObject = exports.writeExtractedSave = exports.extractSave = exports.readSave = void 0;
const big_js_1 = __importDefault(require("big.js"));
const fs_1 = require("fs");
const json_stable_stringify_1 = __importDefault(require("json-stable-stringify"));
const io_1 = require("./io");
const unbundle_1 = require("./unbundle");
const HANDLED_KEYS = [
    "LuaScript",
    "LuaScriptState",
    "XmlUI",
    "ContainedObjects",
    "ObjectStates",
    "States",
    "ChildObjects",
];
const FLOATING_MARKER = ">>floating-point<<";
const DEFAULT_ROUNDING = 4;
const state = {
    files: new Map(),
};
const readSave = (path) => {
    let content = (0, fs_1.readFileSync)(path, { encoding: "utf-8" });
    content = content.replace(/^(\s*"[\w]+": )(-?\d+(?:\.\d+(?:[eE]-\d+)?)?)($|,)/gm, `$1"${FLOATING_MARKER}$2"$3`);
    return JSON.parse(content);
};
exports.readSave = readSave;
/**
 * Extracts the given `saveFile`, by splitting the data into a nested directory structure.
 * It also returns an unbundled version of the save file.
 *
 * @param saveFile The save file to extract.
 * @param options The [[Options]] to use.
 * @returns The unbundled/normalized version of the save file
 */
const extractSave = (saveFile, options) => {
    const unbundledSave = (0, unbundle_1.unbundleSave)(saveFile);
    (0, exports.writeExtractedSave)(unbundledSave, options);
    return unbundledSave;
};
exports.extractSave = extractSave;
const writeExtractedSave = (saveFile, options) => {
    clearState();
    (0, fs_1.mkdirSync)(options.output, { recursive: true });
    extractScripts(saveFile, options.output, options);
    extractContent(saveFile.ObjectStates, options.output + "/", options);
    extractData(saveFile, options.output, options);
};
exports.writeExtractedSave = writeExtractedSave;
const writeExtractedObject = (object, options) => {
    clearState();
    const objectPath = `${options.output}/${getDirectoryName(object)}`;
    (0, fs_1.mkdirSync)(objectPath, { recursive: true });
    extractObject(object, objectPath, options);
};
exports.writeExtractedObject = writeExtractedObject;
const clearState = () => {
    state.files.clear();
};
/**
 * @param object The object to Extract
 * @param path Current nested path where files for this object will be placed at
 */
const extractObject = (object, path, options) => {
    (0, fs_1.mkdirSync)(path, { recursive: true });
    extractScripts(object, path, options);
    if (object.ContainedObjects) {
        extractContent(object.ContainedObjects, path, options);
    }
    extractStates(object, path, options);
    extractChildren(object, path, options);
    extractData(object, path, options);
};
const extractScripts = (object, path, options) => {
    if (object.LuaScript) {
        const ext = options.scriptExtension || "ttslua";
        (0, io_1.writeFile)(`${path}/Script.${ext}`, object.LuaScript);
    }
    if (object.LuaScriptState && options.withState) {
        (0, io_1.writeFile)(`${path}/State.txt`, object.LuaScriptState);
    }
    if (options.metadataField) {
        const metadata = object[options.metadataField];
        if (metadata) {
            (0, io_1.writeFile)(`${path}/Metadata.toml`, metadata);
        }
    }
    if (object.XmlUI) {
        (0, io_1.writeFile)(`${path}/UI.xml`, object.XmlUI);
    }
};
const extractContent = (objects, path, options) => {
    const contents = [];
    objects.forEach((object) => {
        const contentSubPath = options.contentsPath || ".";
        const objectDirectory = getFreeDirectoryName(object, `${path}/${contentSubPath}`);
        const contentsPath = `${contentSubPath}/${objectDirectory}`;
        contents.push({
            path: contentsPath,
        });
        extractObject(object, `${path}/${contentsPath}`, options);
    });
    (0, io_1.writeJson)(`${path}/Contents.json`, contents);
};
const extractStates = (object, path, options) => {
    if (!object.States) {
        return;
    }
    const states = {};
    Object.entries(object.States).forEach(([id, state]) => {
        const statesSubPath = options.statesPath || ".";
        const objectDirectory = getDirectoryName(state);
        const statePath = `${statesSubPath}/${id}-${objectDirectory}`;
        states[id] = {
            path: statePath,
        };
        extractObject(state, `${path}/${statePath}`, options);
    });
    (0, io_1.writeJson)(`${path}/States.json`, states);
};
const extractChildren = (object, path, options) => {
    if (!object.ChildObjects) {
        return;
    }
    const childObjects = [];
    object.ChildObjects.forEach((child) => {
        const childrenSubPath = options.childrenPath || ".";
        const objectDirectory = getDirectoryName(child);
        const childPath = `${childrenSubPath}/${objectDirectory}`;
        childObjects.push({
            path: childPath,
        });
        extractObject(child, `${path}/${childPath}`, options);
    });
    (0, io_1.writeJson)(`${path}/Children.json`, childObjects);
};
const extractData = (object, path, options) => {
    const replacer = (key, value) => dataReplacer(key, value, options);
    let dataContent;
    if (options.keyOrder) {
        dataContent = (0, json_stable_stringify_1.default)(object, {
            replacer: replacer,
            space: 2,
            cmp: (a, b) => keyOrderer(a, b, options.keyOrder),
        });
    }
    else {
        dataContent = JSON.stringify(object, replacer, 2);
    }
    dataContent = dataContent.replace(new RegExp(`"${FLOATING_MARKER}([^"]+)"`, "g"), "$1");
    (0, io_1.writeFile)(`${path}/Data.json`, dataContent);
};
const dataReplacer = (key, value, options) => {
    if (HANDLED_KEYS.includes(key) || key === options.metadataField) {
        return undefined;
    }
    if (options.normalize && typeof value === "string" && value.startsWith(FLOATING_MARKER)) {
        const roundTo = typeof options.normalize === "number" ? options.normalize : DEFAULT_ROUNDING;
        const actualValue = value.slice(FLOATING_MARKER.length);
        const numericValue = (0, big_js_1.default)(actualValue).round(roundTo);
        return `${FLOATING_MARKER}${numericValue}`;
    }
    return value;
};
const keyOrderer = (a, b, keyOrder) => {
    const aOrder = keyOrder.indexOf(a.key);
    const bOrder = keyOrder.indexOf(b.key);
    if (aOrder > -1) {
        return bOrder == -1 ? -1 : aOrder > bOrder ? 1 : -1;
    }
    return bOrder == -1 ? a.key.localeCompare(b.key) : 1;
};
const getDirectoryName = (object) => {
    return `${object.Nickname.length > 0 ? object.Nickname : object.Name}.${object.GUID}`
        .replace(/[^\w \^&'@{}\[\],$=!\-#()%\.+~_]/g, "-");
};
const getFreeDirectoryName = (object, path) => {
    let objectPath = getDirectoryName(object);
    let subFiles = state.files.get(path);
    if (!subFiles) {
        subFiles = new Map();
        state.files.set(path, subFiles);
    }
    const existing = subFiles.get(objectPath);
    if (existing) {
        subFiles.set(objectPath, existing + 1);
        objectPath += `.${existing}`;
    }
    else {
        subFiles.set(objectPath, 1);
    }
    return objectPath;
};
const round = (value, digits = 4) => {
    const offset = Math.pow(10, digits);
    return Math.round(value * offset) / offset;
};
//# sourceMappingURL=extract.js.map