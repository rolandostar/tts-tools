/**
 * Writes the given `content` into a file at the given `path`.
 *
 * @param path Path to write to.
 * @param content The content to write.
 */
export declare const writeFile: (path: string, content: string) => void;
/**
 * Converts `content` into a JSON string and writes it into a file.
 *
 * @param path Path to write to.
 * @param content The content to write.
 */
export declare const writeJson: (path: string, content: any) => void;
