import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // หรือ SMTP อื่น
  auth: {
    user: 'chakrit694@gmail.com',
    pass: 'Guy0636182750',
  },
});

const customerEmail = 'chakrit694@gmail.com';
const orderId = 'ORD123456';
const mailOptions = {
  from: 'chakrit694@gmail.com',
  to: customerEmail,
  subject: 'Order Confirmation บริษัท เบสท เมดิคอล จำกัด',
  text: `ขอบคุณที่สั่งซื้อ! เลขคำสั่งซื้อของคุณคือ ${orderId}`,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});