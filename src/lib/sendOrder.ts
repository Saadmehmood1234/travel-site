import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendBookingConfirmation(
  to: string,
  orderDetails: any,
  customerName: string
) {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to,
    subject: 'Booking Confirmation - Cloudship Holidays',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; border: 1px solid #ddd; }
          .footer { margin-top: 20px; padding: 10px; text-align: center; font-size: 12px; color: #777; }
          .booking-details { margin: 15px 0; }
          .detail-item { margin: 8px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>Thank you for booking with Cloudship Holidays. Your trip has been confirmed.</p>
            
            <div class="booking-details">
              <h3>Booking Details:</h3>
              ${orderDetails.trips.map((trip: any) => `
                <div class="detail-item"><strong>Trip:</strong> ${trip.name}</div>
                <div class="detail-item"><strong>Location:</strong> ${trip.location}</div>
                <div class="detail-item"><strong>Date:</strong> ${new Date(trip.selectedDate).toLocaleDateString()}</div>
                <div class="detail-item"><strong>Travelers:</strong> ${trip.quantity}</div>
                <div class="detail-item"><strong>Amount:</strong> &#x20B9;${trip.price * trip.quantity}</div>
              `).join('')}
              <div class="detail-item"><strong>Total Amount:</strong> &#x20B9;${orderDetails.totalAmount}</div>
            </div>
            
            <p>We're excited to have you on board! You'll receive another email with detailed itinerary and preparation guidelines soon.</p>
            <p>If you have any questions, please contact us at ${process.env.SMTP_EMAIL}.</p>
          </div>
          <div class="footer">
            <p>Cloudship Holidays &copy; ${new Date().getFullYear()}</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}