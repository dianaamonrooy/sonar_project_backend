import axios from "axios";
import { FieldsTallyDTO, LabelFieldTally, TallyDTO, TypeFieldTally } from "../dto/input/tally.dto";

class FormResponsesService {

    /* Uses the type of question to return the exact data that will be put in the database */
    processResponses(field: FieldsTallyDTO){
        if (field.type === TypeFieldTally.HIDDEN_FIELDS || field.type === TypeFieldTally.LINEAR_SCALE){
            return field.value
        }else if (field.type === TypeFieldTally.MULTIPLE_CHOICE || field.type === TypeFieldTally.DROPDOWN){
            const selectedAnswer = field.options?.filter(option => option.id === field.value[0])[0]
            return selectedAnswer?.text
        }else if (field.type === TypeFieldTally.MULTI_SELECT && Array.isArray(field.value)){
            let selectedAnswersArray = []
            field.value.forEach(valueId => {
                const selectedAnswers = field.options?.filter(option => option.id === valueId)
                console.log("SELECTED",selectedAnswers)
                selectedAnswers?.forEach((answer) => selectedAnswersArray.push(answer.text))
            });
            return selectedAnswersArray
        }
    }

    async createNewFormEntry(fieldAnswers: FieldsTallyDTO[]){
        // Gets each field according to it's labels
        const climate = fieldAnswers.filter(field => field.label === LabelFieldTally.CLIMATE)[0]
        const monthlyCost = fieldAnswers.filter(field => field.label === LabelFieldTally.MONTHLYCOST)[0]
        const language = fieldAnswers.filter(field => field.label === LabelFieldTally.LANGUAGE)[0]
        const accomodation = fieldAnswers.filter(field => field.label === LabelFieldTally.ACCOMODATION)[0]
        const activity = fieldAnswers.filter(field => field.label === LabelFieldTally.ACTIVITY)[0]
        const healthcare = fieldAnswers.filter(field => field.label === LabelFieldTally.HEALTHCARE)[0]
        const country = fieldAnswers.filter(field => field.label === LabelFieldTally.COUNTRY)[0]
        const movePlanned = fieldAnswers.filter(field => field.label === LabelFieldTally.MOVEPLANNED)[0]

        // Configures the API 
        const apiUrl = process.env.SUPABASE_ENDPOINT+'/rest/v1/userWebhook';
        const supabaseKey = process.env.API_KEY;

        // Uses the SUPABASE endpoint to add the row
        try {
            const response = await axios.post(apiUrl, {
                climate: this.processResponses(climate),
                monthlyCost: this.processResponses(monthlyCost),
                language: this.processResponses(language),
                accomodation: this.processResponses(accomodation),
                activity: this.processResponses(activity),
                healthcare: this.processResponses(healthcare),
                country: this.processResponses(country),
                movePlanned: this.processResponses(movePlanned) 
            }, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Error creating form entry:', error);
            throw error; 
        }
        
    }
}

export default new FormResponsesService()