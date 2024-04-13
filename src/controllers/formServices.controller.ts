import { TallyDTO } from "../dto/input/tally.dto"
import formResponsesService from "../services/formResponses.service"
import { Request } from "express"

class FormResponsesController{
    async createNewFormEntry(req: Request){
        const body: TallyDTO = req.body
        const fieldAnswers = body.data.fields
        formResponsesService.createNewFormEntry(fieldAnswers)
    }
}

export default new FormResponsesController()