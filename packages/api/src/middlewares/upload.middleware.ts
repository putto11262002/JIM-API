import { koaBody } from "koa-body";
import type Router from "koa-router";

type UploadMiddlewareOptions = {
    allowedMimetype?: string[];
}

/**
 * Save the uploaded files to the a temporary directory and attach the file meta data to the request object. 
 * If files are to be stored permanently, the files should be moved to the permanent location.
 * @param options 
 * @returns 
 */
export function UploadMiddleware({
    allowedMimetype,
}: UploadMiddlewareOptions): Router.IMiddleware[] {
    return [koaBody({
        multipart: true,
        urlencoded: true,
        formidable: {
            filter(part) {
                /**
                 * allowedMimetype is supplied only mimtypes in the list are allowed. 
                 * If not, any mimetype is allowed
                 */
                if (allowedMimetype !== undefined){
                    if (part.mimetype === null || !allowedMimetype.includes(part.mimetype)){
                        return false;

                    }
                }

                /**
                 * TODO - Check size 
                 */


               return true
            },
        }
    })]
}
