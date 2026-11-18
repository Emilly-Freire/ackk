const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../instances/mysql');

class PrevisaoTempo extends Model {}

PrevisaoTempo.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'usuario_id',
        },
        cidade: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        regiao: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        pais: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        latitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(9, 6),
            allowNull: false,
        },
        timezone: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        dados: {
            type: DataTypes.JSON,
            allowNull: false,
        },
        consultadoEm: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'consultado_em',
        },
    },
    {
        sequelize,
        modelName: 'PrevisaoTempo',
        tableName: 'previsoes_tempo',
        timestamps: false,
    }
);

module.exports = PrevisaoTempo;
