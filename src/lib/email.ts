import nodemailer from 'nodemailer';

export async function sendNotificationEmail(review: { name: string; rating: number; comment: string }) {
  // Check if credentials exist, otherwise mock
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.error('[EMAIL] CRITICAL: SMTP credentials missing in environment variables!');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465, // Using SSL/TLS port for better serverless reliability
    secure: true, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // Multiple recipients
    const recipients = [
      'bigpapilacosta092woo@gmail.com',
      'efuwawiah@gmail.com'
    ].join(', ');
    
    console.log(`[EMAIL] Attempting to send notification to: ${recipients}`);
    const info = await transporter.sendMail({
      from: '"Book Reviews" <noreply@example.com>',
      to: recipients,
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
    console.log(`[EMAIL] Success: ${info.messageId}`);
  } catch (error) {
    console.error('[EMAIL] Error occurred during sendMail:', error);
    throw error; // Re-throw so the caller .catch can see it
  }
}
