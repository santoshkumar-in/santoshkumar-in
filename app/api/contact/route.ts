import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { validateContactForm, sanitizeInput } from "@/lib/validation";
import { checkRateLimit, getRemainingTime } from "@/lib/rateLimit";
import { VERSION_CONFIG } from "@/lib/config";
// Verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) return false;

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY not configured");
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score >= 0.5; // reCAPTCHA v3 score threshold
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

// Get client IP address
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIp || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIp = getClientIp(request);

    // Rate limiting
    const rateLimitMax = parseInt(process.env.CONTACT_RATE_LIMIT || "5");
    if (!checkRateLimit(clientIp, rateLimitMax)) {
      const remainingTime = getRemainingTime(clientIp);
      const minutesLeft = Math.ceil(remainingTime / 60000);
      return NextResponse.json(
        {
          success: false,
          error: `Rate limit exceeded. Please try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.`,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, message, recaptchaToken, from } = body;

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateContactForm({ name, email, from, message });
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      from: sanitizeInput(from),
      message: sanitizeInput(message)
    };

    // Check SMTP configuration
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
    };

    if (!smtpConfig.host || !smtpConfig.user || !smtpConfig.password) {
      console.error("SMTP configuration is incomplete");
      return NextResponse.json(
        { success: false, error: "Email service is not configured. Please contact the administrator." },
        { status: 500 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.password,
      },
    });

    const version = sanitizedData.from || 'genai';
    const accent = VERSION_CONFIG[version].accent;
    const accentDim = accent + "22";

    // Email content
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background-color:#0c0e12;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0c0e12;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#10131a;border-radius:10px;overflow:hidden;border:1px solid #1e2535;">

          <!-- Accent bar -->
          <tr>
            <td style="height:3px;background:${accent};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Logo mark -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:${accent};border-radius:6px;padding:6px 10px;display:inline-block;">
                          <span style="font-family:'Courier New',monospace;font-size:13px;font-weight:700;color:#0c0e12;letter-spacing:0.04em;">SK</span>
                        </td>
                        <td style="padding-left:12px;">
                          <span style="font-family:'Courier New',monospace;font-size:13px;color:#e8edf5;letter-spacing:0.02em;">santosh.kumar</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <!-- Version badge -->
                    <span style="font-family:'Courier New',monospace;font-size:10px;color:${accent};background:${accentDim};border:1px solid ${accent}44;border-radius:99px;padding:3px 10px;white-space:nowrap;">
                      ${version}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">
                <tr><td style="height:1px;background:#1e2535;font-size:0;line-height:0;">&nbsp;</td></tr>
              </table>

              <!-- Title -->
              <p style="margin:20px 0 4px;font-family:'Courier New',monospace;font-size:11px;color:#48556e;letter-spacing:0.1em;text-transform:uppercase;">
                New submission
              </p>
              <h1 style="margin:0;font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:400;color:#e8edf5;letter-spacing:-0.01em;">
                Contact Form Message
              </h1>
            </td>
          </tr>

          <!-- Fields -->
          <tr>
            <td style="padding:0 32px 8px;">

              <!-- Name field -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:10px;color:#48556e;letter-spacing:0.1em;text-transform:uppercase;">Name</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:3px;background:${accent};border-radius:2px 0 0 2px;font-size:0;">&nbsp;</td>
                        <td style="background:#141820;padding:10px 14px;border-radius:0 6px 6px 0;">
                          <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:#cdd6e8;">${sanitizedData.name}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Email field -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:10px;color:#48556e;letter-spacing:0.1em;text-transform:uppercase;">Email</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:3px;background:${accent};border-radius:2px 0 0 2px;font-size:0;">&nbsp;</td>
                        <td style="background:#141820;padding:10px 14px;border-radius:0 6px 6px 0;">
                          <a href="mailto:${sanitizedData.email}" style="font-family:'Courier New',monospace;font-size:13px;color:${accent};text-decoration:none;">${sanitizedData.email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message field -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:10px;color:#48556e;letter-spacing:0.1em;text-transform:uppercase;">Message</p>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:3px;background:${accent};border-radius:2px 0 0 2px;font-size:0;">&nbsp;</td>
                        <td style="background:#141820;padding:14px;border-radius:0 6px 6px 0;">
                          <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:#cdd6e8;line-height:1.7;white-space:pre-wrap;">${sanitizedData.message.replace(/\n/g, "<br>")}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0 32px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td style="height:1px;background:#1e2535;font-size:0;line-height:0;">&nbsp;</td></tr>
                <tr>
                  <td style="padding-top:14px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:10px;color:#48556e;">
                            IP &nbsp;<span style="color:#2a3550;">|</span>&nbsp; ${clientIp}
                          </p>
                          <p style="margin:0;font-family:'Courier New',monospace;font-size:10px;color:#48556e;">
                            Time &nbsp;<span style="color:#2a3550;">|</span>&nbsp; ${new Date().toLocaleString()}
                          </p>
                        </td>
                        <td align="right" style="vertical-align:bottom;">
                          <span style="font-family:'Courier New',monospace;font-size:10px;color:#2a3550;">
                            santosh.kumar / contact
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`;

    const emailText = `
New Contact Form Submission

Name: ${sanitizedData.name}
Email: ${sanitizedData.email}

Message:
${sanitizedData.message}

---
Submitted from: ${clientIp}
Time: ${new Date().toLocaleString()}
    `;

    // Send email
    await transporter.sendMail({
      from: `"[santoshkumar.in] Contact" <${smtpConfig.from}>`,
      to: smtpConfig.to,
      replyTo: sanitizedData.email,
      subject: `New [${sanitizedData.from}] Query on [santoshkumar.in] by: ${sanitizedData.name}`,
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while sending your message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
