import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RECIPIENT_EMAIL = "us.gestaltgardens@gmail.com";
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Gestalt Gardens <onboarding@resend.dev>";

// Initialize Resend - will use RESEND_API_KEY from env
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface EmailPayload {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  message: string;
  source?: string;
  archetype?: string;
  estimatedInvestment?: string;
  quizAnswers?: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    if (!resend) {
      console.error("[Email] RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    const body: EmailPayload = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create email subject
    const subject = body.archetype
      ? `New ${body.archetype} Inquiry from ${body.name}`
      : `New Inquiry from ${body.name}`;

    // Create HTML email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #121313; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 2px solid #C8A24A; padding-bottom: 20px; margin-bottom: 30px; }
    .header h1 { color: #0B1F16; font-size: 24px; margin: 0; }
    .section { margin-bottom: 25px; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #A8A39A; margin-bottom: 5px; }
    .value { font-size: 16px; color: #121313; }
    .highlight { background: #F4F1EA; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .highlight-label { color: #C8A24A; font-weight: 600; }
    .message-box { background: #fff; border: 1px solid #E5E5E5; padding: 20px; border-radius: 8px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E5E5; font-size: 12px; color: #A8A39A; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Garden Inquiry</h1>
    </div>
    
    <div class="section">
      <div class="label">Contact</div>
      <div class="value"><strong>${body.name}</strong></div>
      <div class="value">${body.email}</div>
      ${body.phone ? `<div class="value">${body.phone}</div>` : ""}
      ${body.address ? `<div class="value">${body.address}</div>` : ""}
    </div>

    ${
      body.archetype
        ? `
    <div class="highlight">
      <div class="label">Garden Direction</div>
      <div class="value"><span class="highlight-label">${body.archetype}</span></div>
      ${body.estimatedInvestment ? `<div class="value" style="margin-top: 10px;">Estimated Investment: <strong>${body.estimatedInvestment}</strong></div>` : ""}
    </div>
    `
        : ""
    }

    ${
      body.quizAnswers
        ? `
    <div class="section">
      <div class="label">Quiz Responses</div>
      <div class="value">
        ${Object.entries(body.quizAnswers)
          .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
          .join("")}
      </div>
    </div>
    `
        : ""
    }

    <div class="section">
      <div class="label">Message</div>
      <div class="message-box">${body.message.replace(/\n/g, "<br>")}</div>
    </div>

    <div class="section">
      <div class="label">Source</div>
      <div class="value">${body.source || "Contact Form"}</div>
    </div>

    <div class="footer">
      This inquiry was submitted through the Gestalt Gardens website.
    </div>
  </div>
</body>
</html>
    `.trim();

    // Plain text fallback
    const textContent = `
New Garden Inquiry

Name: ${body.name}
Email: ${body.email}
${body.phone ? `Phone: ${body.phone}` : ""}
${body.address ? `Address: ${body.address}` : ""}
${body.archetype ? `Garden Direction: ${body.archetype}` : ""}
${body.estimatedInvestment ? `Estimated Investment: ${body.estimatedInvestment}` : ""}
Source: ${body.source || "Contact Form"}

Message:
${body.message}

---
This inquiry was submitted through the Gestalt Gardens website.
    `.trim();

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: RECIPIENT_EMAIL,
      replyTo: body.email,
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return NextResponse.json(
        { error: "We could not send your message. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out. We will be in touch soon.",
    });
  } catch (error) {
    console.error("[Email] Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
