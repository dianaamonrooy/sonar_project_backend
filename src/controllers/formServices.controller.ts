import { LabelFieldTally, TallyDTO } from "../dto/input/tally.dto"
import formResponsesService from "../services/formResponses.service"
import { Request } from "express"
import suggestionService from "../services/suggestion.service"

class FormResponsesController{
    async createNewFormEntry(req: Request){
        const body: TallyDTO = req.body
        console.log(body.data.fields)
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
            let formData
            if (!hasUserDoneTheSurvey){
                // Create
                console.log("IN CREATE")
                formData = await formResponsesService.createNewFormEntry(email,climate, monthlyCost, language, accomodation, activity, healthcare, country, movePlanned)
                
            }else {
                // Update
                console.log("IN UPDATE")
                formData = await formResponsesService.updateFormEntry(email,climate, monthlyCost, language, accomodation, activity, healthcare, country, movePlanned)

            }
            console.log(formData)
            const allCountries = await suggestionService.getAllCountries()
            const suggestions = await suggestionService.createSuggestion(allCountries,formData)
            console.log(suggestions)
            // // Store suggestions in database
            // // I will always update it (never add a new one) 
            // await suggestionService.storeSuggestion(email.value, suggestions)
        }
    }
}

export default new FormResponsesController()