/**
 * Type for the file describing the contained objects of a [[TTSObject]].
 */
export declare type ContentsFile = ContentEntry[];
/**
 * Describes on entry in the [[ContentsFile]] file.
 */
export interface ContentEntry {
    /** The path to the object's data. */
    path: string;
}
/**
 * Type for the file describing the states of a [[TTSObject]].
 */
export declare type StatesFile = Record<string, StateEntry>;
/**
 * Describes on entry in the [[StatesFile]] file.
 */
export interface StateEntry {
    /** The path to the object's data. */
    path: string;
}
export declare type ChildObjectsFile = ChildObjectEntry[];
export interface ChildObjectEntry {
    path: string;
}
