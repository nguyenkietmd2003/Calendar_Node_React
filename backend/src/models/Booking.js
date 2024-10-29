import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Booking extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      allowNull: false
    },
    guest_email: {
      type: DataTypes.STRING(255),
      allowNull: false
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
          { name: "id" },
        ]
      },
      {
        name: "work_schedule_id",
        using: "BTREE",
        fields: [
          { name: "work_schedule_id" },
        ]
      },
    ]
  });
  }
}
