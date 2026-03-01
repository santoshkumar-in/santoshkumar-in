import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { validateContactForm, sanitizeInput } from "@/lib/validation";
import { checkRateLimit, getRemainingTime } from "@/lib/rateLimit";

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
    const { name, email, message, recaptchaToken } = body;

    // Verify reCAPTCHA
    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!isRecaptchaValid) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // Validate input
    const validation = validateContactForm({ name, email, message });
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
      message: sanitizeInput(message),
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

    // Email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a9eff; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #4a9eff; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${sanitizedData.name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value">${sanitizedData.email}</div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${sanitizedData.message.replace(/\n/g, "<br>")}</div>
              </div>
              <div class="footer">
                <p>Submitted from: ${clientIp}</p>
                <p>Time: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
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
      from: `"Portfolio Contact" <${smtpConfig.from}>`,
      to: smtpConfig.to,
      replyTo: sanitizedData.email,
      subject: `Portfolio Contact: ${sanitizedData.name}`,
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
