import UpdateAgencyService from '@domains/users/services/UpdateAgencyService';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';
import FakeAgencyRepository from '../fakes/FakeAgencyRepository';
import FakeHashProvider from '../fakes/FakeHashProvider';

let fakeAgencyRepository: IAgencyRepository;
let updateAgencyService: UpdateAgencyService;
let fakeHashProvider: IHashProvider;

describe('UpdateAgencyService', () => {
  beforeEach(() => {
    fakeAgencyRepository = new FakeAgencyRepository();
    fakeHashProvider = new FakeHashProvider();

    updateAgencyService = new UpdateAgencyService(
      fakeAgencyRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the agency', async () => {
    const agency = await fakeAgencyRepository.create({
      name: 'Valid Agency Name',
      cnpj: '60603851000150',
      email: 'validemail@email.com',
      password: '123456,',
    });

    const updatedAgency = await updateAgencyService.execute({
      agencyId: agency.id,
      name: 'Updated Valid Name',
      email: 'validupdatedemail@email.com',
    });

    expect(updatedAgency).toBeTruthy();
    expect(updatedAgency.id).toBeTruthy();
    expect(updatedAgency.name).toBe('Updated Valid Name');
    expect(updatedAgency.email).toBe('validupdatedemail@email.com');
  });

  it('should be able to update the agency', async () => {
    const updateMock = jest.spyOn(fakeAgencyRepository, 'update');
    const agency = await fakeAgencyRepository.create({
      name: 'Valid Agency Name',
      cnpj: '60603851000150',
      email: 'validemail@email.com',
      password: '123456,',
    });

    const updatedAgency = await updateAgencyService.execute({
      agencyId: agency.id,
      name: 'Updated Valid Name',
      email: 'validupdatedemail@email.com',
    });

    Object.assign(agency, {
      name: 'Updated Valid Name',
      email: 'validupdatedemail@email.com',
    });

    expect(updatedAgency).toBeTruthy();
    expect(updatedAgency.id).toBeTruthy();
    expect(updatedAgency.name).toBe('Updated Valid Name');
    expect(updatedAgency.email).toBe('validupdatedemail@email.com');
    expect(updateMock).toHaveBeenCalledWith(agency);
  });

  it('should be able to update the agency password', async () => {
    const agency = await fakeAgencyRepository.create({
      name: 'Valid Agency Name',
      cnpj: '60603851000150',
      email: 'validemail@email.com',
      password: '123456',
    });

    const updatedAgency = await updateAgencyService.execute({
      agencyId: agency.id,
      name: 'Updated Valid Name',
      email: 'validupdatedemail@email.com',
      oldpassword: '123456',
      password: '123123',
      password_confirmation: '123123',
    });

    expect(updatedAgency.name).toBe('Updated Valid Name');
    expect(updatedAgency.email).toBe('validupdatedemail@email.com');
    expect(updatedAgency.password).toBe('123123');
  });

  it('should not be able to update a non existing agency', async () => {
    await expect(
      updateAgencyService.execute({
        agencyId: 'NonExistsID',
        name: 'Updated Valid Name',
        email: 'validupdatedemail@email.com',
        oldpassword: '123456',
        password: '123123',
        password_confirmation: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the agency email that is already used', async () => {
    await fakeAgencyRepository.create({
      name: 'Valid Agency Name',
      cnpj: '60603851000150',
      email: 'validemail@email.com',
      password: '123456,',
    });

    const agency = await fakeAgencyRepository.create({
      name: 'Valid Second Agency Name',
      cnpj: '25553541000178',
      email: 'validsecondemail@email.com',
      password: '123456,',
    });

    await expect(
      updateAgencyService.execute({
        agencyId: agency.id,
        name: 'Valid Agency Name',
        email: 'validemail@email.com',
        oldpassword: '123456',
        password: '123123',
        password_confirmation: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the agency password when there is not old password', async () => {
    const agency = await fakeAgencyRepository.create({
      name: 'Valid Second Agency Name',
      cnpj: '25553541000178',
      email: 'validsecondemail@email.com',
      password: '123456,',
    });

    await expect(
      updateAgencyService.execute({
        agencyId: agency.id,
        name: 'Valid Agency Name',
        email: 'validemail@email.com',
        password: '123123',
        password_confirmation: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the agency password with the old password wrong', async () => {
    const agency = await fakeAgencyRepository.create({
      name: 'Valid Second Agency Name',
      cnpj: '25553541000178',
      email: 'validsecondemail@email.com',
      password: '123456,',
    });

    await expect(
      updateAgencyService.execute({
        agencyId: agency.id,
        name: 'Valid Agency Name',
        email: 'validemail@email.com',
        oldpassword: 'wrongOldPassword',
        password: '123123',
        password_confirmation: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the agency password with differents password and passwordconfirmation', async () => {
    const agency = await fakeAgencyRepository.create({
      name: 'Valid Agency Name',
      cnpj: '25553541000178',
      email: 'validemail@email.com',
      password: '123456,',
    });

    await expect(
      updateAgencyService.execute({
        agencyId: agency.id,
        name: 'Valid Second Agency Name',
        email: 'validsecondemail@email.com',
        oldpassword: '123456',
        password: 'combinationOne',
        password_confirmation: 'combinationTwo',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
