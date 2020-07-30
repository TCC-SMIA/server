import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import ShowAgencyService from '@domains/users/services/ShowAgencyService';
import AppError from '@shared/errors/AppError';
import FakeAgencyRepository from '../fakes/FakeAgencyRepository';

let fakeAgencyRepository: IAgencyRepository;
let showAgencyService: ShowAgencyService;

describe('ShowAgencyService', () => {
  beforeEach(() => {
    fakeAgencyRepository = new FakeAgencyRepository();

    showAgencyService = new ShowAgencyService(fakeAgencyRepository);
  });

  it('should be able to show the agency logged', async () => {
    const agency = await fakeAgencyRepository.create({
      name: 'valid_agency_name',
      email: 'valid_email@mail.com',
      cnpj: '58.017.080/0001-78',
      password: 'valid_password',
    });

    const agencyProfile = await showAgencyService.execute({
      agencyId: agency.id,
    });

    expect(agencyProfile.name).toBe('valid_agency_name');
    expect(agencyProfile.email).toBe('valid_email@mail.com');
    expect(agencyProfile.cnpj).toBe('58.017.080/0001-78');
  });

  it('should not be able to show a non existing agency', async () => {
    await expect(
      showAgencyService.execute({ agencyId: 'DontExistingId' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
