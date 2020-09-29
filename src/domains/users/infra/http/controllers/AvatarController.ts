import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import { Response, Request } from 'express';

import UpdateAvatarService from '@domains/users/services/UpdateAvatarService';

class AvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { filename } = request.file;

    const updateAvatar = container.resolve(UpdateAvatarService);

    const { user, user_type } = await updateAvatar.execute({
      user_id,
      avatarFilename: filename,
    });

    return response.json({ user: classToClass(user), user_type });
  }
}

export default new AvatarController();
