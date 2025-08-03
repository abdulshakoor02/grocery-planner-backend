import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { dbAdapter } from '../../service/database/database';
import { UsersModel } from './users';

const modelDefinition = {
  name: 'messages',
  define: {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    chatId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'messages',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    messages: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at',
    },
  },
};

export interface IMessagesModel
  extends Model<
    InferAttributes<IMessagesModel>,
    InferCreationAttributes<IMessagesModel>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: string;
  userId: string;
  chatId: string;
  role: string;
  messages: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const MessagesModel = dbAdapter.define<IMessagesModel>(
  modelDefinition.name,
  modelDefinition.define,
  {
    underscored: true,
    timestamps: true,
  },
);

MessagesModel.belongsTo(UsersModel, { foreignKey: 'userId' });
MessagesModel.belongsTo(MessagesModel, { foreignKey: 'chatId' });
