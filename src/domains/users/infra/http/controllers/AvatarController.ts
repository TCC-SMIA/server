import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import { Response, Request } from 'express';

import UpdateUserAvatarService from '@domains/users/services/UpdateUserAvatarService';

class AvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { filename } = request.file;

    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      user_id,
      avatarFilename: filename,
    });

    return response.json(classToClass(user));
  }
}

export default new AvatarController();
