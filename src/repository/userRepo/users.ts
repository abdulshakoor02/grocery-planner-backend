import { UsersModel, IUsersModel } from 'src/models';

export const getUser = async (userId: string): Promise<IUsersModel> => {
  const user = await UsersModel.findOne({
    where: { id: userId },
  });
  return user;
};
