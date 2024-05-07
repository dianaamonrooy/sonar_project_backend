import axios from "axios";

class SuggestionService {

    async getAllCountries(){
        // const apiUrl = process.env.SUPABASE_ENDPOINT +'/rest/v1/country?select=countryID,name'
        const apiUrl2 = process.env.SUPABASE_ENDPOINT +'/rest/v1/visa?select=minAge,minIncomeInDollars,country(countryID,name,nativeLanguage,englishTalked,safety(description),livingCost(level))'
        const supabaseKey = process.env.API_KEY

        try {
            const response = await axios.get(apiUrl2, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            
            let data = []
            response.data.forEach(row => {
                // Deletes the "and" of the input and splits in an array
                const languages = row.country.nativeLanguage?.match(/\b(?!and\b)\w+\b/g) ?? []
                // Adds 'English' if necessary
                if (row.country.englishTalked && languages.indexOf('English') === -1) languages.push('English')
                
                data.push({
                    "country":row.country.name,
                    "minAge": row.minAge,
                    "minIncomeInDollarsPerMonth": row.minIncomeInDollars,
                    "languages": languages
                })
            })
            // console.log(data)

            return data;
        } catch (error) {
            console.error('Error getting country info:', error);
            throw error; 
        }

    }

    convertToRange(monthlyCost){
        monthlyCost = '$1000 - $2000'
        monthlyCost = monthlyCost.replace("$","")
        let  numbersOfRange = monthlyCost.match(/\d+/g)
        if (numbersOfRange.length === 1) numbersOfRange.push(1000000)
        return numbersOfRange
    }

    // Creates the list of possible destinations based on user's form
    async createSuggestion(allCountries, formData) {
        
        let selectedCountries = []

        // Filter 1: minIncomePerMonth
        const range = this.convertToRange(formData.monthlyCost)
        selectedCountries = allCountries.filter(country => country.minIncomeInDollarsPerMonth <= parseInt(range[1]))
        // If no matches, returns all of the countries
        if (selectedCountries.length === 0) selectedCountries = allCountries

        // Filter 2: climate
        let apiUrl = process.env.SUPABASE_ENDPOINT + '/rest/v1/country-climate?select=country(name),climate(typeOfClimate)'
        const supabaseKey = process.env.API_KEY
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            const countries = response.data 
            let newSelectedCountries = []
            countries.forEach((elem) => {
                if (elem.climate.typeOfClimate === formData.climate) {
                    newSelectedCountries.push(selectedCountries.filter(e => e.country === elem.country.name)[0])
                }
            })
            selectedCountries = newSelectedCountries
            // If no matches, returns all of the countries
            if (selectedCountries.length === 0) selectedCountries = allCountries
        } catch (error) {
            console.error('Error getting country info:', error);
            throw error; 
        }

        //Filter 3: Language
        let newSelectedCountries = []
        formData.language.forEach(languageFormData => {
            selectedCountries.forEach(elem => {
                // If the language of the form is in the elem.languages and if the elem hasn't been pushed into the newSelectedCountries
                if (elem.languages.indexOf(languageFormData) != -1 && newSelectedCountries.indexOf(elem) === -1){
                    newSelectedCountries.push(elem)
                }
            })
        });
        selectedCountries = newSelectedCountries
        // If no matches, returns all of the countries
        if (selectedCountries.length === 0) selectedCountries = allCountries


        // Filter 4: Activity
        apiUrl = process.env.SUPABASE_ENDPOINT + '/rest/v1/country-activity?select=country(name),activity(name)'
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            });
            const countries = response.data 
            let newSelectedCountries = []
            countries.forEach((elem) => {
                formData.activity.forEach(activity => {
                    if (elem.activity.name === activity) {
                        const selected = selectedCountries.filter(e => e.country === elem.country.name)[0]
                        if (selected) newSelectedCountries.push(selected)
                    }
                })
                
            })
            selectedCountries = newSelectedCountries
            // If no matches, returns all of the countries
            if (selectedCountries.length === 0) selectedCountries = allCountries
        } catch (error) {
            console.error('Error getting country info:', error);
            throw error; 
        }

        // Filter 5: country chosen
        const chosenCountry = allCountries.filter(elem => elem.country === formData.country)[0]
        if (selectedCountries.indexOf(chosenCountry) === -1) selectedCountries.push(chosenCountry)
        // console.log(selectedCountries)

        // RETURNS ONLY THE NAME
        let selectedCountryNames = []
        selectedCountries.forEach(elem => {
            selectedCountryNames.push(elem.country)
        })
        let allCountryNames = []
        allCountries.forEach(elem => {
            allCountryNames.push(elem.country)
        })

        return selectedCountryNames.length > 1 ? selectedCountryNames : allCountryNames

        /** STRUCTURE OF DATA 
         * 
         * ALL COUNTRIES
            country: 'Spain',
            minAge: 'Not specified',
            minIncomeInDollarsPerMonth: 0,
            languages: [ 'Spanish', 'English' ]

         * FORM DATA
            climate: 'Temperate', -----> USE climaVScountry
            monthlyCost: 'More than $4000', -----> Should convert it into a range
            language: [ 'Spanish' ], -----> check if any of the countries languages are in here 
            accomodation: 'Condo',   (not really useful now)
            activity: [ 'Cultural Events', 'Other' ],  -----> USE activitiesVScountry
            healthcare: 7, (not useful)
            country: 'Brazil',  -----> ADD IT DIRECTLY
            movePlanned: 'Within 1 year' (not useful)

         * Link para traer climaVScountry
            https://gjwqjozqeewvtnrdthqh.supabase.co/rest/v1/country-climate?select=country(name),climate(typeOfClimate)

         * Link para traer activitiesVScountry
            https://gjwqjozqeewvtnrdthqh.supabase.co/rest/v1/country-activity?select=country(name),activity(name)
         * 
         * 
        */

    }

    // Stores suggestion
    async storeSuggestion(email, suggestions){

        // Configures the API 
        const apiUrl = process.env.SUPABASE_ENDPOINT+`/rest/v1/userWebhook?email=eq.${email}`;
        const supabaseKey = process.env.API_KEY

        try {
            const formData = {
                suggestion: suggestions
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
        // curl -X PATCH 'https://gjwqjozqeewvtnrdthqh.supabase.co/rest/v1/user?some_column=eq.someValue' \
        // -H "apikey: SUPABASE_CLIENT_ANON_KEY" \
        // -H "Authorization: Bearer SUPABASE_CLIENT_ANON_KEY" \
        // -H "Content-Type: application/json" \
        // -H "Prefer: return=minimal" \
        // -d '{ "other_column": "otherValue" }'

    }

    // Checks if user has already done the survey
    async isSuggestionStored(email: string){
        const supabaseKey = process.env.API_KEY
        const apiUrl = process.env.SUPABASE_ENDPOINT+'/rest/v1/user?email=eq.'+email+'&select=*';
        

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

}
export default new SuggestionService()