
const fs = require('fs');
// const path = require('path');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
// const puppeteer = require('puppeteer');

const createPDF = () => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('payslip.pdf'));
  doc.text('Hello, this is a sample PDF document.');
  doc.end();
};

const sendPayslipSalary = async (fileBuffer, employee, month, year) => {

  const time = getMonthName(month) + ' ' + year;

  const htmlContent = fs.readFileSync('src/services/payslipContent.html', 'utf-8');

  let content = htmlContent.replace('{{time}}', time).replace('{{name}}', employee.fullName).replace('{{company}}', 'UTE Corp');

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER_EMAIL,
    subject: `Payslip ${employee.fullName} ${time}`,
    html: content,
    attachments: [
      {
        filename: `${employee.fullName}_payslip.pdf`,
        content: fileBuffer
      }
    ]
  };
  sendMail(mailOptions);
};

const sendNotificationLeaveRequest = async (data) => {
  const content = await generateHtmlContentLeaveRequest(data, 'src/services/leaveRequest.html')
  var mailReceives = data.approvalStatus.map(x => x?.employee?.email);

  const mailOptions = {
    from: process.env.EMAIL,
    to: mailReceives ? mailReceives : process.env.RECEIVER_EMAIL,
    subject: `Leave request from ${data.employee.fullName}`,
    html: content,
  };
  sendMail(mailOptions);
}

const generateHtmlContentLeaveRequest = async (data, filePath) => {
  const htmlContent = fs.readFileSync(filePath, 'utf-8');
  const href = `${process.env.FRONTEND_URL}leaves/leave-request-detail/${data._id}`
  let content = htmlContent.replace(/{{name}}/g, data.employee.fullName).replace(/{{leaveType}}/g, data.leaveType.name).replace(/{{date}}/g, data.date.toLocaleDateString()).replace(/{{time}}/g, data.timeValue * 8).replace(/{{des}}/g, data.reason).replace(/{{href}}/g, href);

  return content;
}
function getMonthName(monthNumber) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', { month: 'short' });
}

const sendMail = async (mailOptions) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    tls: {
      rejectUnauthorized: true
    },
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

}


module.exports = { createPDF, sendPayslipSalary, sendNotificationLeaveRequest };