const cognate = (
  sequelize,
  DataTypes
) => {
  const Cognate = sequelize.define(
    'cognate',
    {
      english: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg:
              'A cognate has to have english text.',
          },
        },
      },
      russian: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg:
              'A cognate has to have russian text.',
          },
        },
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVocab: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      }
    }
  );

  Cognate.associate = models => {
    Cognate.belongsTo(models.User);
  };

  return Cognate;
};

export default cognate;

