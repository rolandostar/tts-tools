import { SaveFile } from "./model/tts";
/**
 * Available options for [[embedSave]].
 */
export interface Options {
    /** The path where the scripts and XML files will be included from. */
    includePaths: string[];
    metadataField?: string;
    /** File extension for scripts */
    scriptExtension?: "ttslua" | "lua";
    luaPatterns?: string[];
}
export declare const readExtractedSave: (path: string, options: Options) => SaveFile;
/**
 * Embeds the content of an previously extracted save file and returns a new save file.
 *
 * @param path The path to an extracted save file.
 * @param options The [[Options]] to use.
 * @returns The embedded save file.
 */
export declare const embedSave: (path: string, options: Options) => SaveFile;
