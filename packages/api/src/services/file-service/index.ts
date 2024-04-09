import { ApplicationFile } from "@jimmodel/shared";
import stream from "node:stream"
import { File } from "../../types/file";

export interface IFIleService {
    /**
     * Save file to the file storage
     * @param file 
     * @returns 
     */
    saveFile: (file: File) => Promise<ApplicationFile>;

    /**
     * Save file from a readable stream
     * @param fileStream 
     * @param mimeType 
     * @param size 
     * @returns 
     */
    saveFileFromReadableStream: (fileStream: stream.Readable, mimeType: string) => Promise<ApplicationFile>;
    /**
     * Delete file from the file storage
     * @param id 
     * @returns 
     */
    deleteFile: (id: string) => Promise<void>;
    /**
     * Retrieve file metadata from the database
     * @param id 
     * @returns 
     */
    getFileMetaData: (id: string) => Promise<ApplicationFile>;
  }
  
  
  
