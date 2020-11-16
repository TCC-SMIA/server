import 'reflect-metadata';
import { injectable } from 'tsyringe';

import { ComplaintTypeEnum } from '../enums/ComplaintTypeEnum';

interface IComplaintTypesResponse {
  complaint_types: string[];
}

@injectable()
class GetAvailableComplaintTypeService {
  public async execute(): Promise<IComplaintTypesResponse> {
    return {
      complaint_types: [
        ComplaintTypeEnum.IrregularDeforestation,
        ComplaintTypeEnum.IrregularDumpingOfGarbage,
        ComplaintTypeEnum.StrandingOfMarineAnimals,
        ComplaintTypeEnum.WildAnimalsOutOfTheirHabitat,
        ComplaintTypeEnum.Others,
      ],
    };
  }
}

export default GetAvailableComplaintTypeService;
