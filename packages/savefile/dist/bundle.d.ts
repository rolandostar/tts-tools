import { Options } from "./embed";
import { SaveFile, TTSObject } from "./model/tts";
/**
 * Creates a copy of the given save file and bundles all Lua/XML scripts with the given options.
 */
export declare const bundleSave: (saveFile: SaveFile, options: Options) => any;
/**
 * Create a copy of the given object and bundles its own and contained Lua/XML scripts with the given options.
 */
export declare const bundleObject: (object: TTSObject, options: Options) => any;
