/* global process */
import nodemailer from 'nodemailer';

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = String(process.env.SMTP_SECURE || 'true').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('Email credentials not configured (SMTP_USER/SMTP_PASS)');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

export async function sendEmail({ to, subject, text, html }) {
  const transporter = getTransporter();
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const info = await transporter.sendMail({ from, to, subject, text, html });
  return info;
}

export function buildVerifyEmail({ email, token }) {
  const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${appUrl}/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  const subject = 'Verify your email - AE-FUNAI Navigator';
  const text = `Welcome to AE-FUNAI Navigator!\n\nYour verification code is: ${token}\n\nYou can also verify by clicking this link:\n${link}\n\nIf you did not request this, please ignore.`;
  const html = `
    <p>Welcome to <strong>AE-FUNAI Navigator</strong>!</p>
    <p>Your verification code is: <strong>${token}</strong></p>
    <p>You can also verify by clicking this link:</p>
    <p><a href="${link}">Verify Email</a></p>
    <p>If you did not request this, please ignore.</p>
  `;
  return { subject, text, html };
}

export function buildResetEmail({ email, token }) {
  const appUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const link = `${appUrl}/reset-password?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
  const subject = 'Reset your password - AE-FUNAI Navigator';
  const text = `You requested a password reset.\n\nYour reset code is: ${token}\n\nReset via link (valid for 30 minutes):\n${link}\n\nIf you did not request this, please ignore.`;
  const html = `
    <p>You requested a password reset.</p>
    <p>Your reset code is: <strong>${token}</strong></p>
    <p>Reset via link (valid for 30 minutes):</p>
    <p><a href="${link}">Reset Password</a></p>
    <p>If you did not request this, please ignore.</p>
  `;
  return { subject, text, html };
}

export function buildAdminGraphNotice({ actorEmail, changed }) {
  const subject = 'Graph updated - AE-FUNAI Navigator';
  const text = `Admin ${actorEmail} updated the campus graph.\n\n${changed}`;
  const html = `<p>Admin <strong>${actorEmail}</strong> updated the campus graph.</p><pre>${changed}</pre>`;
  return { subject, text, html };
}
