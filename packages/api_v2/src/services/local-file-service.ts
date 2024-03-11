import { FileMetaData, Prisma } from "@prisma/client";

import config from "../config";
import { prisma } from "../prisma";
import fs from "fs/promises";
import path from "path";
import {v4 as uuid} from "uuid"
import NotFoundError from "../lib/errors/not-found-error";

export interface IFIleService {
  saveFile: (file: Express.Multer.File) => Promise<FileMetaData>;
  deleteFile: (id: string) => Promise<void>;
  getFileMetaData: (id: string) => Promise<FileMetaData>;
}


async function saveFile(file: Express.Multer.File): Promise<FileMetaData> {
    const extension = path.extname(file.originalname);
    const fileName = `${uuid()}${extension}`
  const newPath = path.join(config.FILE_STORAGE_PATH, `${fileName}`);

  await fs.copyFile(file.path, newPath);

  const url = new URL(config.SERVER_URL)

  url.pathname = path.join(config.SERVE_STATIC_PATH, fileName)

  const fileMetaDataInput: Prisma.FileMetaDataCreateInput = {
    mimeType: file.mimetype,
    size: file.size,
    path: newPath,
    url: 
      url.toString(),
  };

  const savedFileMetaData = await prisma.fileMetaData.create({
    data: fileMetaDataInput,
  });

  return savedFileMetaData;
}

async function deleteFile(id: string): Promise<void> {
  const fileMetaData = await prisma.fileMetaData.findUnique({ where: { id } });
  if (fileMetaData === null) throw new Error("File not found");

  await fs.unlink(fileMetaData.path);

  await prisma.fileMetaData.delete({ where: { id } });
}

async function getFileMetaData(id: string): Promise<FileMetaData> {
  const fileMetaData = await prisma.fileMetaData.findUnique({ where: { id } });
  if (fileMetaData === null) throw new NotFoundError("File not found");
  return fileMetaData;
}

export default {
  saveFile,
  deleteFile,
  getFileMetaData
};
