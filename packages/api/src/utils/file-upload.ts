import type formidable from "formidable";
import type { IAppRouterContext } from "../types/app";
import ValidationError from "./errors/validation.error";

export function getSingleFileFromCtx(
    ctx: IAppRouterContext,
    field: string
): formidable.File {
    const files = ctx.request.files;
    const target = files?.[field];
    const image = Array.isArray(target) ? target[0] : target;
    if (image === undefined) {
        throw new ValidationError(`${field} is required`);
    }
    return image;
}
