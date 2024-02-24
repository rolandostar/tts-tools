import { SaveFile, TTSObject } from "./model/tts";
/**
 * Takes a TTS save file and unbundles it.
 *
 * @param saveFile The save to unbundle
 * @returns A copy of the given save file where all Lua and XML scripts are unbundled.
 */
export declare const unbundleSave: (saveFile: SaveFile) => SaveFile;
export declare const unbundleObject: (object: TTSObject) => TTSObject;
