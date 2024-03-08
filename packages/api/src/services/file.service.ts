import type { File } from "../types/file";

import { injectable } from "inversify";

import fs from "fs";
import mmmagicpkg, { Magic } from "mmmagic";
import { v4 as uuid } from "uuid";
import _path from "path";
import mime from "mime-types";


const fsPromise = fs.promises;
const { MAGIC_MIME_TYPE } = mmmagicpkg;

export interface IFileService {
    createFile: (path: string) => Promise<File>;
    // getFileStream: (key: string) => Promise<ReadableStream>;
    // deleteFile: (key: string) => Promise<void>;
    // getPublicFileUrl: (key: string) => Promise<string>;
}

export type FileServiceOptions = { uploadDir: string; baseUrl: string,  };

@injectable()
export class LocalFileService implements IFileService {
    private readonly options: FileServiceOptions;

    private readonly mmm: Magic;

    constructor(options: FileServiceOptions) {
        this.options = options;
        this.mmm = new Magic(MAGIC_MIME_TYPE);
    }

    public async createFile(path: string): Promise<File> {
      

        const mimetype = await new Promise<string>((resolve, reject) => {
            this.mmm.detectFile(path, (err, result) => {
                if (err !== null) {
                    reject(err);
                }
                resolve(Array.isArray(result) ? result[0] : result);
            });
        });

        // Derive file extension from mimetype
        const extension = mime.extension(mimetype);

        // Generate file key in the format of uuid.extension
        const uuidKey = uuid();
        const key = `${uuidKey}.${extension}`;

        // File path is the base upload directory path + file key
        const newFilePath = _path.join(this.options.uploadDir, key);

        try {
            await fsPromise.access(newFilePath, fs.constants.F_OK);
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
                throw err;
            }
            // TODO - handle if file already exists
        }

        await fsPromise.access(path, fs.constants.R_OK);

        // const fd = await fsPromise.open(newFilePath, fs.constants.O_CREAT | fs.constants.O_WRONLY)

        await fsPromise.copyFile(path, newFilePath);

        const stats = await fsPromise.stat(newFilePath);
        const bytesWritten = stats.size;

        const url = new URL(key, this.options.baseUrl).toString();

        return {
            url,
            size: bytesWritten,
            mimetype,
            key,
        };
    }
}
