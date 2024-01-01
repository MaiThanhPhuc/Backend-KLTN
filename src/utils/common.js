var generator = require('generate-password');

const generatePassword = async () => {
  return generator.generate({
    length: 10,
    uppercase: true,
    lowercase: true,
    numbers: true,
  });
}

const countWorkingDayByMonth = async () => {
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1;
  let count = 0;
  for (let day = 1; day <= new Date(year, month, 0).getDate(); day++)
    count += new Date(year, month - 1, day).getDay() >= 1 && new Date(year, month - 1, day).getDay() <= 5;
  return count;
}

module.exports = { generatePassword, countWorkingDayByMonth };
