import { FileMetaData } from "@jimmodel/shared";
import config from "../config";
import * as pgk from "@prisma/client";
import { prisma } from "../prisma";
import fs from "fs/promises";
import path from "path";
import { v4 as uuid } from "uuid";
import NotFoundError from "../lib/errors/not-found-error";
import { imageWriter } from "../lib/file-processors/image";

export interface IFIleService {
  saveFile: (file: Express.Multer.File) => Promise<FileMetaData>;
  deleteFile: (id: string) => Promise<void>;
  getFileMetaData: (id: string) => Promise<FileMetaData>;
  saveImage: (file: Express.Multer.File) => Promise<ImageMetaData>;
}

export interface Writer<T extends unknown[] = [], R = void> {
  write: (orginal: string, processed: string, ...args: T) => Promise<R>;
  supported: (mimetype: string) => boolean;
}

const passThroughtWriter: Writer = {
  write: async (original: string, processed: string) => {
    await fs.copyFile(original, processed);
  },
  supported: (mimetype: string) => {
    return true;
  },
};

const registerWriter: Writer<unknown[], unknown>[] = [imageWriter];

function getWriter(mimetype: string): Writer<unknown[], unknown> {
  return (
    registerWriter.find((processor) => processor.supported(mimetype)) ||
    passThroughtWriter
  );
}

export type ImageMetaData = FileMetaData & { width: number; height: number };

async function saveImage(file: Express.Multer.File): Promise<ImageMetaData> {
  const extension = path.extname(file.originalname);
  const fileName = `${uuid()}${extension}`;
  const newPath = path.join(config.FILE_STORAGE_PATH, `${fileName}`);

  const {height, width} = await imageWriter.write(file.path, newPath);

  const url = new URL(config.SERVER_URL);

  url.pathname = path.join(config.SERVE_STATIC_PATH, fileName);

  const fileMetaDataInput: pgk.Prisma.FileMetaDataCreateInput = {
    mimeType: file.mimetype,
    size: file.size,
    path: newPath,
    url: url.toString(),
  };

  const savedFileMetaData = await prisma.fileMetaData.create({
    data: fileMetaDataInput,
  });

  return {...savedFileMetaData, height, width};
}

async function saveFile(file: Express.Multer.File): Promise<FileMetaData> {
  const extension = path.extname(file.originalname);
  const fileName = `${uuid()}${extension}`;
  const newPath = path.join(config.FILE_STORAGE_PATH, `${fileName}`);

  const writer = getWriter(file.mimetype);

  await writer.write(file.path, newPath);

  const url = new URL(config.SERVER_URL);

  url.pathname = path.join(config.SERVE_STATIC_PATH, fileName);

  const fileMetaDataInput: pgk.Prisma.FileMetaDataCreateInput = {
    mimeType: file.mimetype,
    size: file.size,
    path: newPath,
    url: url.toString(),
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
  getFileMetaData,
  saveImage
};
