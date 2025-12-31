import nodemailer from 'nodemailer';

export async function sendNotificationEmail(review: { name: string; rating: number; comment: string }) {
  // Check if credentials exist, otherwise mock
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('---------------------------------------------------');
    console.log(`[MOCK EMAIL] New Review Received from ${review.name}`);
    console.log(`Rating: ${review.rating}/5`);
    console.log(`Comment: ${review.comment}`);
    console.log('---------------------------------------------------');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"Book Reviews" <noreply@example.com>',
    to: process.env.NOTIFICATION_EMAIL || 'bigpapilacosta092woo@gmail.com', 
    subject: `New Review: ${review.rating} Stars from ${review.name}`,
    text: `You have received a new review:\n\nName: ${review.name}\nRating: ${review.rating}/5\n\n"${review.comment}"`,
    html: `
      <h2>New Review Received</h2>
      <p><strong>Name:</strong> ${review.name}</p>
      <p><strong>Rating:</strong> ${review.rating}/5 stars</p>
      <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
        "${review.comment}"
      </blockquote>
    `,
  });
}
