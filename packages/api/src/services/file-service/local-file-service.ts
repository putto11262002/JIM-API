import { ApplicationFile, ApplicationFileCreateInput } from "@jimmodel/shared";
import config from "../../config";
import * as pgk from "@prisma/client";
import { prisma } from "../../prisma";
import fsPromise from "node:fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import NotFoundError from "../../lib/errors/not-found-error";
import fs from "node:fs"
import stream from "node:stream"
import { File } from "../../types/file";
import { IFIleService } from ".";

async function saveFileFromReadableStream(fileStream: stream.Readable, mimetype: string): Promise<ApplicationFile> {
  const extension = mimetype.split('/')[1];
  const fileName = `${uuid()}.${extension}`;
  const newPath = path.join(config.FILE_STORAGE_PATH, `${fileName}`);
  const writeStream = fs.createWriteStream(newPath);

  return new Promise((resolve, reject) => {
    fileStream.pipe(writeStream);

    let error: Error | null = null;

    writeStream.on('error', (err) => {
      error = err;
      writeStream.close();
      reject(err);
    });

    writeStream.on("finish", async () => {
      if (!error) {
        const url = new URL(config.SERVER_URL);
        url.pathname = path.join(config.SERVE_STATIC_PATH, fileName);
        const size = fs.statSync(newPath).size;
        const fileMetaDataInput: ApplicationFileCreateInput = {
        mimetype,
          size,
          path: newPath,
          url: url.toString(),
        };
        const savedFileMetaData = await prisma.applicationFile.create({ data: fileMetaDataInput });
        resolve(savedFileMetaData);
      }
    });
  });
}

async function saveFile(file: File): Promise<ApplicationFile> {
  const extension = path.extname(file.path);
  const fileName = `${uuid()}${extension}`;
  const newPath = path.join(config.FILE_STORAGE_PATH, `${fileName}`);

  await fsPromise.copyFile(file.path, newPath);

  const url = new URL(config.SERVER_URL);

  url.pathname = path.join(config.SERVE_STATIC_PATH, fileName);

  const fileMetaDataInput: ApplicationFileCreateInput = {
    mimetype: file.mimetype,
    size: file.size,
    path: newPath,
    url: url.toString(),
  };

  const savedFileMetaData = await prisma.applicationFile.create({
    data: fileMetaDataInput,
  });

  return savedFileMetaData;
}

async function deleteFile(id: string): Promise<void> {
  const fileMetaData = await prisma.applicationFile.findUnique({ where: { id } });
  if (fileMetaData === null) throw new Error("File not found");

  try{
    await fsPromise.unlink(fileMetaData.path);
  }catch(e){
    throw new Error(`File meta data mismatch: file not found at ${fileMetaData.path}`)
  }

  await prisma.applicationFile.delete({ where: { id } });
}

async function getFileMetaData(id: string): Promise<ApplicationFile> {
  const fileMetaData = await prisma.applicationFile.findUnique({ where: { id } });
  if (fileMetaData === null) throw new NotFoundError("File not found");
  return fileMetaData;
}

const localFileService: IFIleService = {
  saveFile,
  deleteFile,
  getFileMetaData,
  saveFileFromReadableStream

}

export default localFileService;