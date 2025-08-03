import { MessagesModel, IMessagesModel } from 'src/models/interfaces/messages';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export const createNewChat = async (
  messages: string,
  role: string,
  userId: string,
): Promise<IMessagesModel> => {
  const chatId = uuidv4();
  const chat = await MessagesModel.create({
    chatId,
    userId,
    role,
    messages,
    id: chatId,
  });
  return chat;
};

export const additionalChat = async (
  messages: string,
  userId: string,
  role: string,
  chatId: string,
): Promise<IMessagesModel> => {
  const chat = await MessagesModel.create({
    chatId,
    userId,
    messages,
  });
  return chat;
};

export const chatCount = async (chatId: string): Promise<number> => {
  const chat = await MessagesModel.count({
    where: { chatId },
  });
  return chat;
};

export const chatContext = async (chatId: string): Promise<number> => {
  const chat = await MessagesModel.count({
    where: { chatId },
  });
  return chat;
};

export const chatForToday = async (userId: string): Promise<number> => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const chat = await MessagesModel.count({
    where: { userId, createdAt: { [Op.between]: [startOfToday, endOfToday] } },
  });
  return chat;
};

export const chatForMonth = async (userId: string): Promise<number> => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );
  const chat = await MessagesModel.count({
    where: { userId, createdAt: { [Op.between]: [startOfMonth, endOfMonth] } },
  });
  return chat;
};
