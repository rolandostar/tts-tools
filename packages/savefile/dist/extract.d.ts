import { SaveFile, TTSObject } from "./model/tts";
/**
 * Available options for [[extractSave]].
 */
export interface Options {
    /** The path where the save file will be extracted to. */
    output: string;
    /** If set, floating point values will be rounded to the 4th decimal point. */
    normalize?: boolean | number;
    withState?: boolean;
    metadataField?: string;
    contentsPath?: string;
    statesPath?: string;
    childrenPath?: string;
    keyOrder?: string[];
    /** File extension for scripts */
    scriptExtension?: "ttslua" | "lua";
}
export declare const readSave: (path: string) => SaveFile;
/**
 * Extracts the given `saveFile`, by splitting the data into a nested directory structure.
 * It also returns an unbundled version of the save file.
 *
 * @param saveFile The save file to extract.
 * @param options The [[Options]] to use.
 * @returns The unbundled/normalized version of the save file
 */
export declare const extractSave: (saveFile: SaveFile, options: Options) => SaveFile;
export declare const writeExtractedSave: (saveFile: SaveFile, options: Options) => void;
export declare const writeExtractedObject: (object: TTSObject, options: Options) => void;
