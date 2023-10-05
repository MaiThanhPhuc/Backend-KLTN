var generator = require('generate-password');

const generatePassword = () => {
  return generator.generate({
    length: 10,
    uppercase: true,
    lowercase: true,
    numbers: true,
  });
};

module.export = { generatePassword };
