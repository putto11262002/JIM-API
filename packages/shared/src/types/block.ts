import {Prisma, Block as _Block} from "@jimmodel/database"
import { Model } from "./model-type"


export type Block = _Block & {
    models: Model[]
}

export type BlockCreateInput = Omit<Prisma.BlockCreateInput, "models"> & {
    modelIds: string[]
}