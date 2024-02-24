"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleObject = exports.bundleSave = void 0;
const xmlbundle_1 = require("@tts-tools/xmlbundle");
const lodash_1 = require("lodash");
const luabundle_1 = require("luabundle");
const path_1 = require("path");
/**
 * Creates a copy of the given save file and bundles all Lua/XML scripts with the given options.
 */
const bundleSave = (saveFile, options) => {
    return (0, lodash_1.cloneDeepWith)(saveFile, bundler(options));
};
exports.bundleSave = bundleSave;
/**
 * Create a copy of the given object and bundles its own and contained Lua/XML scripts with the given options.
 */
const bundleObject = (object, options) => {
    return (0, lodash_1.cloneDeepWith)(object, bundler(options));
};
exports.bundleObject = bundleObject;
/**
 * Function factory to be used with cloneDeepWith to bundle Lua and XML scripts.
 *
 * @param options The options object.
 * @returns The cuztomizer function for cloneDeepWith.
 */
const bundler = (options) => (value, key, obj) => {
    if (!value)
        return undefined;
    if (key === "LuaScript") {
        return luaBundle(obj.LuaScript, options.includePaths, options.luaPatterns);
    }
    else if (key == "XmlUI") {
        return (0, xmlbundle_1.bundle)(value, options.includePaths);
    }
};
/**
 * Bundles the given Lua `script` by resolving `require()` calls using the given `includePaths`.
 *
 * @param script The script content.
 * @param includePaths The path array to look for additional includes.
 * @returns The bundled script.
 */
const luaBundle = (script, includePaths, luaPatterns) => {
    // Default patterns to look for Lua files, can be overridden by the user
    luaPatterns = luaPatterns ?? ['?.lua', '?.ttslua'];
    // Combine both arrays to create a list of paths to look for includes
    const paths = luaPatterns.flatMap(pt => includePaths.map(p => (0, path_1.join)(p, pt)));
    // Also add the patterns directly to account for absolute paths
    paths.push(...luaPatterns);
    const bundled = (0, luabundle_1.bundleString)(script, { paths });
    return bundled.startsWith("-- Bundled") ? bundled + "\n" : bundled;
};
//# sourceMappingURL=bundle.js.map