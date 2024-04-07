import sharp from "sharp"
import { Writer } from "../../services/local-file-service"

export const ACCEPTED_IMAGE_MIMETYPE = ["image/jpeg", "image/png", "image/gif"]
export const imageWriter: Writer<[], {width: number, height: number}> =  {
    write: async (orginal: string, processed: string, config: {format: sharp.AvailableFormatInfo} = {format: sharp.format.jpeg}) => {
      
      const metaData = await sharp(orginal).metadata()
      const diff = (metaData.width ?? 0 ) - (metaData.height ?? 0)
      let newDim: {width: number, height: number}
      if (Math.abs(diff) < 10){
        newDim = {width: 512, height: 512}
      }else if (diff < 0){ // Portrait
        newDim = {width: 576, height: 1024}
      }else {
        newDim = {width: 1024, height: 576}
      }
  
  
      await sharp(orginal)
        .resize(newDim.width, newDim.height)
        .toFormat(config.format)
        .toFile(processed)

        return {width: newDim.width, height: newDim.height}
      
    },
    supported: (mimetype: string) => {
      return ACCEPTED_IMAGE_MIMETYPE.includes(mimetype)
    }
    
  }
  