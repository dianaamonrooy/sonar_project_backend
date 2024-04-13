export type TallyDTO = {
    eventId: string
    eventType: string
    createdAt: string
    data: DataTallyDTO
}

class DataTallyDTO {
    responseId: string
    submissionId: string
    respondentId: string
    formId: string
    formName: string
    createdAt: string
    fields: FieldsTallyDTO[]
}

export type FieldsTallyDTO = {
    key: string
    label: LabelFieldTally
    type: TypeFieldTally
    value: string | string[] | number
    options?: OptionsFieldTallyDTO[]
}

class OptionsFieldTallyDTO{
    id: string
    text: string
}

export enum TypeFieldTally {
    HIDDEN_FIELDS = "HIDDEN_FIELDS",
    MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
    MULTI_SELECT = "MULTI_SELECT",
    LINEAR_SCALE = "LINEAR_SCALE",
    DROPDOWN = "DROPDOWN"
}

export enum LabelFieldTally  {
    EMAIL= "email",
    CLIMATE = "What is your ideal climate?",
    MONTHLYCOST = "How much are you comfortable spending monthly?",
    LANGUAGE = "Which language(s) would you like to be surrounded by?",
    ACCOMODATION = "What type of accommodation do you prefer?",
    ACTIVITY = "What kind of activities would you like to do?",
    HEALTHCARE = "How important is access to healthcare facilities for you? ",
    COUNTRY = "Do you have any specific country in mind?",
    MOVEPLANNED = "When do you plan to move? ",
    BEENBEFORE = "Have you visited the country/countries you are considering before?",
}