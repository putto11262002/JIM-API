export const ModelGender= {
    FEMALE: {
        value: "female",
        label: "Women"
    },
    OTHER: {
        value: "other",
        label: "LGBTQ"
    },
    MALE: {
        value: "male",
        label: "Men"
    }
}

export const ModelGenderLabel = {
    [ModelGender.FEMALE.value]: ModelGender.FEMALE.label,
    [ModelGender.MALE.value]: ModelGender.MALE.label,
    [ModelGender.OTHER.value]: ModelGender.OTHER.label 
}