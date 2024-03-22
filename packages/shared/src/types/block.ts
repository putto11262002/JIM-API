import * as db from "@prisma/client"
import { Model } from "./model-type.js"



export type Block = db.Block & {
    models: Model[]
}

export type BlockCreateInput = Omit<db.Prisma.BlockCreateInput, "models"> & {
    modelIds: string[]
}