import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Booking extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_booking: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    work_schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'WorkSchedule',
        key: 'id'
      }
    },
    guest_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    guest_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      allowNull: true,
      defaultValue: "pending"
    }
  }, {
    sequelize,
    tableName: 'Booking',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_booking" },
        ]
      },
      {
        name: "work_schedule_id",
        using: "BTREE",
        fields: [
          { name: "work_schedule_id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
