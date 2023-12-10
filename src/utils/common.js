var generator = require('generate-password');

const generatePassword = () => {
  return generator.generate({
    length: 10,
    uppercase: true,
    lowercase: true,
    numbers: true,
  });
};

const countWorkingDayByMonth = (date) => {
  // Get the number of days in the month
  var daysInMonth = new Date(year, month, 0).getDate();

  // Initialize a count for working days
  var workingDayCount = 0;

  // Loop through each day in the month
  for (var day = 1; day <= daysInMonth; day++) {
    // Create a Date object for the current day
    var currentDate = new Date(year, month - 1, day);

    // Check if the current day is a weekday (Monday to Friday)
    if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
      workingDayCount++;
    }
  }

  return workingDayCount;
}

module.export = { generatePassword, countWorkingDayByMonth };
