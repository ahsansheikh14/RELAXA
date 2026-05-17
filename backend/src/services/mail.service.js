import nodemailer from 'nodemailer';
import { Resend } from 'resend';

const isEnvValueSet = (value = '') => {
  const normalized = String(value).trim();
  return Boolean(normalized) && !normalized.toLowerCase().includes('replace_with');
};

const normalizeSmtpPassword = (password = '') => String(password).replace(/\s+/g, '');

const buildResetEmailContent = (resetLink) => ({
  subject: 'Relaxa Password Reset',
  text: `Reset your password using this secure link (valid for 15 minutes): ${resetLink}`,
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1b1c1c;">
      <h2 style="color: #0c5252;">Relaxa Password Reset</h2>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetLink}" style="background:#0c5252;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;">
          Reset Password
        </a>
      </p>
      <p>Or copy this link (valid for 15 minutes):</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `,
});

const sendViaResend = async ({ to, resetLink }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM || 'Relaxa <onboarding@resend.dev>';
  const content = buildResetEmailContent(resetLink);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  if (error) {
    throw new Error(error.message || 'Resend could not send email.');
  }

  return { provider: 'resend' };
};

const getSmtpTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!isEnvValueSet(SMTP_HOST) || !isEnvValueSet(SMTP_PORT) || !isEnvValueSet(SMTP_USER) || !isEnvValueSet(SMTP_PASS)) {
    return null;
  }

  const port = Number(SMTP_PORT);

  return nodemailer.createTransport({
    host: String(SMTP_HOST).trim(),
    port,
    secure: port === 465,
    auth: {
      user: String(SMTP_USER).trim(),
      pass: normalizeSmtpPassword(SMTP_PASS),
    },
    ...(port === 587 ? { requireTLS: true } : {}),
  });
};

const sendViaSmtp = async ({ to, resetLink }) => {
  const transporter = getSmtpTransporter();

  if (!transporter) {
    throw new Error('SMTP is not configured.');
  }

  const from = isEnvValueSet(process.env.SMTP_FROM) ? process.env.SMTP_FROM.trim() : process.env.SMTP_USER.trim();
  const content = buildResetEmailContent(resetLink);

  await transporter.verify();
  await transporter.sendMail({
    from,
    to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  return { provider: 'smtp' };
};

const sendPasswordResetEmail = async ({ to, resetLink }) => {
  if (isEnvValueSet(process.env.RESEND_API_KEY)) {
    return sendViaResend({ to, resetLink });
  }

  if (getSmtpTransporter()) {
    return sendViaSmtp({ to, resetLink });
  }

  throw new Error('No email provider configured. Add RESEND_API_KEY or SMTP settings.');
};

export { sendPasswordResetEmail };
