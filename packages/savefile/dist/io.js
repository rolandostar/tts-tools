"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJson = exports.writeFile = void 0;
const fs_1 = require("fs");
/**
 * Writes the given `content` into a file at the given `path`.
 *
 * @param path Path to write to.
 * @param content The content to write.
 */
const writeFile = (path, content) => {
    (0, fs_1.writeFileSync)(path, content, { encoding: "utf-8" });
};
exports.writeFile = writeFile;
/**
 * Converts `content` into a JSON string and writes it into a file.
 *
 * @param path Path to write to.
 * @param content The content to write.
 */
const writeJson = (path, content) => {
    const jsonContent = JSON.stringify(content, null, 2) + "\n";
    (0, exports.writeFile)(path, jsonContent);
};
exports.writeJson = writeJson;
//# sourceMappingURL=io.js.map