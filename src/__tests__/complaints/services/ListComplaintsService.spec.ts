import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import ListComplaintsService from '@domains/complaints/services/ListComplaintsService';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let listComplaintsService: ListComplaintsService;

describe('ListComplaintsService', () => {
  beforeEach(() => {
    fakeComplaintsRepository = new FakeComplaintsRepository();
    listComplaintsService = new ListComplaintsService(fakeComplaintsRepository);
  });

  it('should be able to create a complaint', async () => {});
});
