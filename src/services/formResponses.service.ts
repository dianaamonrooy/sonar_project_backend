import axios from "axios";
import { FieldsTallyDTO, LabelFieldTally, TypeFieldTally } from "../dto/input/tally.dto";

class FormResponsesService {

    // Checks if user has already done the survey
    async isEmailInSurveys(email: string){
        const supabaseKey = process.env.API_KEY
        const apiUrl = process.env.SUPABASE_ENDPOINT+'/rest/v1/userWebhook?email=eq.'+email+'&select=*';

        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            if ((response.data).length === 0){
                return false
            }else return true
            
        } catch (error) {
            console.error('Error creating form entry:', error);
            throw error; 
        }

    }

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
                // console.log("SELECTED",selectedAnswers)
                selectedAnswers?.forEach((answer) => selectedAnswersArray.push(answer.text))
            });
            return selectedAnswersArray
        }
    }

    // Creates a new row in the Supabase
    async createNewFormEntry(
        email: FieldsTallyDTO, 
        climate: FieldsTallyDTO,
        monthlyCost: FieldsTallyDTO,
        language: FieldsTallyDTO,
        accomodation: FieldsTallyDTO,
        activity: FieldsTallyDTO,
        healthcare: FieldsTallyDTO,
        country: FieldsTallyDTO,
        movePlanned: FieldsTallyDTO
    ){
        
        // Configures the API 
        const apiUrl = process.env.SUPABASE_ENDPOINT+'/rest/v1/userWebhook';
        const supabaseKey = process.env.API_KEY

        // Uses the SUPABASE endpoint to add the row
        try {
            const formData = {
                email: this.processResponses(email),
                climate: this.processResponses(climate),
                monthlyCost: this.processResponses(monthlyCost),
                language: this.processResponses(language),
                accomodation: this.processResponses(accomodation),
                activity: this.processResponses(activity),
                healthcare: this.processResponses(healthcare),
                country: this.processResponses(country),
                movePlanned: this.processResponses(movePlanned)
            }
            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                }
            });
            return formData;
        } catch (error) {
            console.error('Error creating form entry:', error);
            throw error; 
        }
        
    }

    // Updates data based on the email
    async updateFormEntry(
        email: FieldsTallyDTO, 
        climate: FieldsTallyDTO,
        monthlyCost: FieldsTallyDTO,
        language: FieldsTallyDTO,
        accomodation: FieldsTallyDTO,
        activity: FieldsTallyDTO,
        healthcare: FieldsTallyDTO,
        country: FieldsTallyDTO,
        movePlanned: FieldsTallyDTO
    ){
        
        // Configures the API 
        const apiUrl = process.env.SUPABASE_ENDPOINT+`/rest/v1/userWebhook?email=eq.${this.processResponses(email)}`;
        const supabaseKey = process.env.API_KEY

        try {
            const formData = {
                climate: this.processResponses(climate),
                monthlyCost: this.processResponses(monthlyCost),
                language: this.processResponses(language),
                accomodation: this.processResponses(accomodation),
                activity: this.processResponses(activity),
                healthcare: this.processResponses(healthcare),
                country: this.processResponses(country),
                movePlanned: this.processResponses(movePlanned) 
            }
            const response = await axios.patch(apiUrl, formData, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                }
            });

            return formData
            
        } catch (error) {
            console.error('Error creating form entry:', error);
            throw error; 
        }
        
    }

}

export default new FormResponsesService()