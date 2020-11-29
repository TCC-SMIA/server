import GetAvailableComplaintTypeService from '@domains/complaints/services/GetAvailableComplaintTypeService';

let service: GetAvailableComplaintTypeService;

describe('GetAvailableComplaintTypeService', () => {
  beforeAll(() => {
    service = new GetAvailableComplaintTypeService();
  });

  it('Shoulb be able to get the available complaint types', async () => {
    const types = await service.execute();

    expect(types).toBeTruthy();
    expect(types).toHaveProperty('complaint_types');
    expect(types.complaint_types).toBeInstanceOf(Array);
  });
});
