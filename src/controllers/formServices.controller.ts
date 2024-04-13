import { LabelFieldTally, TallyDTO } from "../dto/input/tally.dto"
import formResponsesService from "../services/formResponses.service"
import { Request } from "express"

class FormResponsesController{
    async createNewFormEntry(req: Request){
        const body: TallyDTO = req.body
        const fieldAnswers = body.data.fields

        // Gets each field according to it's labels
        const email = fieldAnswers.filter(field => field.label === LabelFieldTally.EMAIL)[0]
        const climate = fieldAnswers.filter(field => field.label === LabelFieldTally.CLIMATE)[0]
        const monthlyCost = fieldAnswers.filter(field => field.label === LabelFieldTally.MONTHLYCOST)[0]
        const language = fieldAnswers.filter(field => field.label === LabelFieldTally.LANGUAGE)[0]
        const accomodation = fieldAnswers.filter(field => field.label === LabelFieldTally.ACCOMODATION)[0]
        const activity = fieldAnswers.filter(field => field.label === LabelFieldTally.ACTIVITY)[0]
        const healthcare = fieldAnswers.filter(field => field.label === LabelFieldTally.HEALTHCARE)[0]
        const country = fieldAnswers.filter(field => field.label === LabelFieldTally.COUNTRY)[0]
        const movePlanned = fieldAnswers.filter(field => field.label === LabelFieldTally.MOVEPLANNED)[0]
        if (typeof email.value === 'string') {
            const hasUserDoneTheSurvey = await formResponsesService.isEmailInSurveys(email.value)
            if (!hasUserDoneTheSurvey){
                // Create
                console.log("IN CREATE")
                await formResponsesService.createNewFormEntry(email,climate, monthlyCost, language, accomodation, activity, healthcare, country, movePlanned)
            }else {
                // Update
                console.log("IN UPDATE")
                await formResponsesService.updateFormEntry(email,climate, monthlyCost, language, accomodation, activity, healthcare, country, movePlanned)

            }
        }
        
    }
}

export default new FormResponsesController()