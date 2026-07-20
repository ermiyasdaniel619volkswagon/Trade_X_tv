import nodemailer from 'nodemailer';

const requiredMailSettings = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'MAIL_FROM'];

const getTransporter = () => {
  const missing = requiredMailSettings.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Email is not configured. Missing: ${missing.join(', ')}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export const sendPasswordResetEmail = async ({ email, resetUrl, firstName }) => {
  const safeName = escapeHtml(firstName || 'Customer');
  const safeUrl = escapeHtml(resetUrl);
  const frontendUrl = String(process.env.FRONTEND_URL || '').trim().replace(/\/$/, '');
  const logoUrl = String(process.env.MAIL_LOGO_URL || (frontendUrl ? `${frontendUrl}/logo.png` : '')).trim();
  const safeLogoUrl = /^https:\/\//i.test(logoUrl) ? escapeHtml(logoUrl) : '';
  const supportEmail = String(process.env.SUPPORT_EMAIL || process.env.SMTP_USER || '').trim();
  const safeSupportEmail = escapeHtml(supportEmail);
  const logoMarkup = safeLogoUrl
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto;background:#ffffff;border-radius:12px;"><tr><td bgcolor="#ffffff" style="padding:12px 18px;border-radius:12px;background:#ffffff;background-image:linear-gradient(#ffffff,#ffffff);"><img src="${safeLogoUrl}" width="180" alt="Trade X TV" style="display:block;width:180px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;"></td></tr></table>`
    : '<div style="font-size:24px;line-height:30px;font-weight:800;letter-spacing:.3px;color:#ffffff;">Trade X TV</div>';

  await getTransporter().sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: 'Reset your Trade X TV password',
    text: `Hello ${firstName || 'Customer'},\n\nWe received a request to reset the password for your Trade X TV customer account.\n\nReset your password: ${resetUrl}\n\nFor your security, this link expires in 15 minutes and can only be used once. If you did not request this change, no action is needed and your current password remains secure.${supportEmail ? `\n\nNeed help? Contact us at ${supportEmail}.` : ''}\n\nTrade X TV Customer Care`,
    html: `
      <!doctype html>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="color-scheme" content="light">
          <title>Reset your Trade X TV password</title>
        </head>
        <body style="margin:0;padding:0;background:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#263247;">
          <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">Your secure Trade X TV password reset link expires in 15 minutes.</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3f5f8;">
            <tr>
              <td align="center" style="padding:32px 14px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(26,50,88,.10);">
                  <tr>
                    <td align="center" bgcolor="#1A3258" style="padding:24px 34px;background:#1A3258;border-bottom:4px solid #B69F60;">
                      ${logoMarkup}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:38px 34px 18px;">
                      <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#f7f0df;color:#765f25;font-size:12px;line-height:16px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;">Account security</div>
                      <h1 style="margin:18px 0 12px;font-size:28px;line-height:36px;color:#1A3258;">Let&rsquo;s reset your password</h1>
                      <p style="margin:0 0 14px;font-size:16px;line-height:26px;">Hello ${safeName},</p>
                      <p style="margin:0;font-size:16px;line-height:26px;color:#4b5870;">We received a request to create a new password for your Trade X TV customer account. Use the secure button below to continue.</p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:12px 34px 28px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td align="center" style="border-radius:10px;background:#A53D32;">
                            <a href="${safeUrl}" style="display:inline-block;padding:15px 28px;color:#ffffff;font-size:16px;line-height:20px;font-weight:700;text-decoration:none;border-radius:10px;">Create new password</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 34px 30px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f7f9fc;border:1px solid #e5eaf1;border-radius:12px;">
                        <tr>
                          <td style="padding:18px 20px;font-size:14px;line-height:22px;color:#4b5870;">
                            <strong style="color:#1A3258;">For your security</strong><br>
                            This link expires in <strong>15 minutes</strong> and can only be used once. Trade X TV will never ask you to email us your password.
                          </td>
                        </tr>
                      </table>
                      <p style="margin:24px 0 8px;font-size:14px;line-height:22px;color:#667085;">If you did not request this change, you can safely ignore this message. Your current password will remain unchanged.</p>
                      <p style="margin:16px 0 5px;font-size:12px;line-height:19px;color:#8791a3;">If the button does not work, copy and paste this link into your browser:</p>
                      <p style="margin:0;word-break:break-all;font-size:12px;line-height:19px;"><a href="${safeUrl}" style="color:#A53D32;text-decoration:underline;">${safeUrl}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:23px 34px;background:#f7f9fc;border-top:1px solid #e5eaf1;text-align:center;font-size:12px;line-height:19px;color:#7a8496;">
                      <strong style="color:#1A3258;">Trade X TV Customer Care</strong>
                      ${safeSupportEmail ? `<br>Need help? <a href="mailto:${safeSupportEmail}" style="color:#A53D32;text-decoration:none;">${safeSupportEmail}</a>` : ''}
                      <br>This is an automated security message. Please do not share this email.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>`,
  });
};
