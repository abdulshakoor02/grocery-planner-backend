import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { dbAdapter } from 'src/service/database/database';

const modelDefinition = {
  name: 'users',
  define: {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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

export interface IUsersModel
  extends Model<
    InferAttributes<IUsersModel>,
    InferCreationAttributes<IUsersModel>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: string;
  name: string;
  email: string;
  mobile: string;
  password: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export const UsersModel = dbAdapter.define<IUsersModel>(
  modelDefinition.name,
  modelDefinition.define,
  {
    underscored: true,
    timestamps: true,
  },
);
