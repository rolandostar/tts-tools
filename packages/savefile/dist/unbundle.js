"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unbundleObject = exports.unbundleSave = void 0;
const xmlbundle_1 = require("@tts-tools/xmlbundle");
const lodash_1 = require("lodash");
const luabundle_1 = require("luabundle");
/**
 * Takes a TTS save file and unbundles it.
 *
 * @param saveFile The save to unbundle
 * @returns A copy of the given save file where all Lua and XML scripts are unbundled.
 */
const unbundleSave = (saveFile) => {
    return (0, lodash_1.cloneDeepWith)(saveFile, unbundler);
};
exports.unbundleSave = unbundleSave;
const unbundleObject = (object) => {
    return (0, lodash_1.cloneDeepWith)(object, unbundler);
};
exports.unbundleObject = unbundleObject;
const unbundler = (value, key, obj) => {
    if (key === "LuaScript") {
        return unbundleLuaScript(obj);
    }
    else if (key == "XmlUI" && value) {
        return xmlUnbundle(value);
    }
    return undefined;
};
const unbundleLuaScript = (object) => {
    if (object.LuaScript) {
        try {
            let script = object.LuaScript;
            if (script.includes("-- Bundled by luabundle")) {
                // quickfixex - luabundle seems to have a problem when the line ending ist not \n,
                // which can easily happens when people copy/paste a bundled sript to TTS
                // also it doesn't whitespace at the beginning which can also happens during copy/paste
                script = script.replace(/^\s*/, "");
                script = script.replace(/(-- Bundled by luabundle {[^}]+})\s*\n/, "$1\n");
                const unbundled = (0, luabundle_1.unbundleString)(script, { rootOnly: true });
                return unbundled.modules[unbundled.metadata.rootModuleName].content;
            }
            return script;
        }
        catch (e) {
            console.error(`Error during extracting script for object ${object.Nickname}-${object.GUID}`, e);
        }
    }
    return "";
};
/**
 * Unbundles the bundled XML `xmlUI` by removing all included files and replacing them with the `<Include src="" />` directive again.
 *
 * @param xmlUi The script content.
 * @returns The unbundled script.
 */
const xmlUnbundle = (xmlUi) => {
    return (0, xmlbundle_1.unbundle)(xmlUi);
};
//# sourceMappingURL=unbundle.js.map