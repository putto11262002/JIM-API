
export const ModelGender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    NON_BINARY: "NON_BINARY",
    

} as const


export const ModelImageType =  {
    POLAROID: "POLAROID",
    BOOK: "BOOK",
    COMPOSITE: "COMPOSITE",
} as const

export type ModelImageType = typeof ModelImageType[keyof typeof ModelImageType]

export type ModelGender = typeof ModelGender[keyof typeof ModelGender]