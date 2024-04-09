import sharp from "sharp";
import { File } from "../types/file";
import fs from "node:fs"

type AvailableFormat = keyof sharp.FormatEnum;

type Dimension = {
  width: number;
  height: number;
};

export class ApplicationImage {
  /**
   * Default dimensions for square images when using autoReize
   */
  public static DEFAULT_SQUARE_DIMENSIONS = {
    width: 400,
    height: 400,
  };

  /**
   * Default dimensions for landscape images when using autoReize
   */
  public static DEFAULT_LANDSCAPE_DIMENSIONS = {
    width: 600,
    height: 400,
  };

  /**
   * Default dimensions for protrait images when using autoReize
   */
  public static DEFAULT_PORTRAIT_DIMENSIONS = {
    width: 400,
    height: 600,
  };

  public static DEFAULT_FORMAT: AvailableFormat = "webp";

  public static SUPPORTED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg"
  ];

  private originalFile: File;

  private sharpInstance?: sharp.Sharp;

  public width!: number;

  public height!: number;

  public format!: AvailableFormat;



  constructor(file: File) {
    if (!ApplicationImage.SUPPORTED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error("Unsupported file type");
    }
    this.originalFile = file;

  }

  public async getSharpInstance() {
    if (!this.sharpInstance) {
      this.sharpInstance = sharp(fs.readFileSync(this.originalFile.path));
      const {width, height, format} = await this.sharpInstance.metadata();
      if (width === undefined || height === undefined || format === undefined){
          throw new Error("Cannot read image metadata")
      }
      this.width = width;
      this.height = height;
      this.format = format as AvailableFormat;
    }
    return this.sharpInstance!;
  }



  public async  autoResize(options?: {
    portraitDimension?: Dimension;
    landscapeDimension?: Dimension;
    squareDimension?: Dimension;
  }) {
    const allowedDiff = 0.1;
    const actuallDiff = this.height - this.width;

    const dimensions =
      Math.abs(actuallDiff) < allowedDiff
        ? options?.squareDimension ?? ApplicationImage.DEFAULT_SQUARE_DIMENSIONS
        : actuallDiff > 0
        ? options?.portraitDimension ??
          ApplicationImage.DEFAULT_PORTRAIT_DIMENSIONS
        : options?.landscapeDimension ??
          ApplicationImage.DEFAULT_LANDSCAPE_DIMENSIONS;

    (await this.getSharpInstance()).resize(dimensions.width, dimensions.height);
    this.width = dimensions.width;
    this.height = dimensions.height;
    return dimensions
  }

  public async resize({ width, height }: { width: number; height: number }) {
  
    (await this.getSharpInstance()).resize(width, height);
    this.width = width;
    this.height = height;
    return {width, height};
  }

  public async formatTo(format: AvailableFormat = ApplicationImage.DEFAULT_FORMAT) {
    (await this.getSharpInstance()).toFormat(format);
    this.format = format;
    return format;
  }

  /**
   * Validate if the image has the expected dimensions and format. If no arguments are provided, it will validate against the default dimensions and format
   * @param args The expected dimensions and format
   * @returns True if the image has the expected dimensions and format, false otherwise
   */
  public async validate(args?: {expectedWidth: number, expectedHeight: number, expectedFormat: AvailableFormat}){
  

    if (args){
        return this.width === args.expectedWidth && this.height === args.expectedHeight && this.format === args.expectedFormat
    }

    let dimensionCheck: boolean
    if (this.width === this.height){
        dimensionCheck = this.width === ApplicationImage.DEFAULT_SQUARE_DIMENSIONS.width && this.height === ApplicationImage.DEFAULT_SQUARE_DIMENSIONS.height
    }else if (this.width > this.height){
        dimensionCheck = this.width === ApplicationImage.DEFAULT_LANDSCAPE_DIMENSIONS.width && this.height === ApplicationImage.DEFAULT_LANDSCAPE_DIMENSIONS.height
    }else{
        dimensionCheck = this.width === ApplicationImage.DEFAULT_PORTRAIT_DIMENSIONS.width && this.height === ApplicationImage.DEFAULT_PORTRAIT_DIMENSIONS.height
    }

    return dimensionCheck && this.format === ApplicationImage.DEFAULT_FORMAT

  }

  public getReadableStream(){
    return this.getSharpInstance()
  }
}
