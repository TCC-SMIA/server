import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import DeleteComplaintService from '@domains/complaints/services/DeleteComplaintService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';
import FakeUsersRepository from '../../users/fakes/FakeUsersRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let deleteComplaintService: DeleteComplaintService;
let fakeUsersRepository: IUsersRepository;

describe('DeleteComplaintService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeComplaintsRepository = new FakeComplaintsRepository();
    deleteComplaintService = new DeleteComplaintService(
      fakeComplaintsRepository,
    );
  });

  it('should be able to delete the complaint', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const date = new Date();

    const complaint = await fakeComplaintsRepository.create({
      user_id: user.id,
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    const deleteFuncion = jest.spyOn(fakeComplaintsRepository, 'delete');

    await deleteComplaintService.execute({
      user_id: user.id,
      complaint_id: complaint.id,
    });

    expect(deleteFuncion).toBeCalledWith(complaint);
  });

  it('should not be able to delete a non existing complaint', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    await expect(
      deleteComplaintService.execute({
        user_id: user.id,
        complaint_id: 'invalid_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a non complaint that user have not created', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const date = new Date();

    const complaint = await fakeComplaintsRepository.create({
      user_id: user.id,
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    await expect(
      deleteComplaintService.execute({
        user_id: 'invalid_id',
        complaint_id: complaint.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
