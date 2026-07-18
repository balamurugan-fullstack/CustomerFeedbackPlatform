import nodemailer from 'nodemailer';
import { env } from '../config/env';

export async function sendFeedbackNotification(payload: {
  name: string;
  email: string;
  category: string;
  comments: string;
  createdAt: Date | string;
}): Promise<void> {
  if (!env.MAIL_USER || !env.MAIL_PASS || !env.ADMIN_NOTIFICATION_EMAIL) {
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: env.MAIL_USER,
    to: env.ADMIN_NOTIFICATION_EMAIL,
    subject: `New feedback received from ${payload.name}`,
    html: `
      <h2>New customer feedback</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Category:</strong> ${payload.category}</p>
      <p><strong>Timestamp:</strong> ${new Date(payload.createdAt).toISOString()}</p>
      <p><strong>Feedback:</strong></p>
      <p>${payload.comments.replace(/\n/g, '<br />')}</p>
    `,
  });
}
