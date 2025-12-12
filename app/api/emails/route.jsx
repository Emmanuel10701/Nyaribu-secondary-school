import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import nodemailer from "nodemailer";

// Email sender setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// School Information
const SCHOOL_NAME = 'Nyaribu Secondary School';
const SCHOOL_LOCATION = 'Kiganjo, Nyeri County';
const SCHOOL_MOTTO = 'Soaring for Excellence';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'info@nyaribusecondary.sc.ke';
const SCHOOL_WEBSITE = 'https://nyaribusecondary.sc.ke';

// Main Email Template Layout
const emailTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; background: #f7f9fc; padding: 20px 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 30px 20px; text-align: center; }
    .logo { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
    .tagline { font-size: 14px; opacity: 0.9; margin-top: 5px; }
    .location { font-size: 12px; opacity: 0.8; margin-top: 2px; }
    .content { padding: 30px; }
    .message-container { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #1e3c72; }
    .message-title { color: #1e3c72; font-size: 18px; font-weight: 600; margin-bottom: 12px; }
    .message-content { color: #4b5563; font-size: 15px; line-height: 1.6; white-space: pre-line; }
    .footer { background: #1e293b; color: #9ca3af; text-align: center; padding: 25px 20px; font-size: 12px; }
    .btn { display: inline-block; background: #1e3c72; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin: 10px 0; transition: background 0.3s; }
    .btn:hover { background: #2a5298; }
    .school-info { background: #f0f7ff; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid #e2e8f0; }
    .info-title { color: #1e3c72; font-size: 14px; font-weight: 600; margin-bottom: 8px; }
    .info-content { color: #4b5563; font-size: 13px; line-height: 1.5; }
    @media (max-width: 620px) { .container { width: 95% !important; } .content { padding: 20px; } .header { padding: 25px 15px; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🏫 ${SCHOOL_NAME}</div>
      <div class="tagline">${SCHOOL_MOTTO}</div>
      <div class="location">${SCHOOL_LOCATION}</div>
    </div>
    
    <div class="content">
      <div class="message-container">
        <div class="message-title">${data.subject}</div>
        <div class="message-content">${data.message || data.content}</div>
      </div>

      <div class="school-info">
        <div class="info-title">About Our School</div>
        <div class="info-content">
          ${SCHOOL_NAME} is a public day school in ${SCHOOL_LOCATION} serving 400+ students with the 8-4-4 curriculum system. 
          We are committed to providing quality education and holistic development for all students.
        </div>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="${SCHOOL_WEBSITE}" class="btn">Visit Our School Website →</a>
      </div>
    </div>
    
    <div class="footer">
      <div style="margin-bottom: 15px;">
        <div style="color: #d1d5db; font-weight: 600; margin-bottom: 8px;">${SCHOOL_NAME}</div>
        <div>📍 ${SCHOOL_LOCATION}</div>
        <div>📞 ${CONTACT_PHONE} • ✉️ ${CONTACT_EMAIL}</div>
        <div style="margin-top: 5px; color: #9ca3af; font-size: 11px;">Public Day School • 400+ Students • 8-4-4 Curriculum</div>
      </div>
      
      <div style="margin: 15px 0;">
        <a href="#" style="color: #60a5fa; margin: 0 8px; text-decoration: none;">Facebook</a> • 
        <a href="#" style="color: #60a5fa; margin: 0 8px; text-decoration: none;">Twitter</a> • 
        <a href="#" style="color: #60a5fa; margin: 0 8px; text-decoration: none;">Instagram</a>
      </div>
      
      <div style="color: #6b7280; font-size: 11px;">
        &copy; ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;

async function sendEmails(campaign) {
  const recipients = campaign.recipients.split(",").map(r => r.trim());
  
  const htmlContent = emailTemplate({
    subject: campaign.subject,
    message: campaign.content,
    content: campaign.content
  });

  const sentRecipients = [];
  const failedRecipients = [];

  for (const recipient of recipients) {
    try {
      await transporter.sendMail({
        from: `"${SCHOOL_NAME}" <${process.env.EMAIL_USER}>`,
        to: recipient,
        subject: `${campaign.subject} - ${SCHOOL_NAME}`,
        html: htmlContent,
        text: campaign.content.replace(/<[^>]*>/g, '')
      });
      sentRecipients.push(recipient);
      console.log(`✅ Email sent to: ${recipient}`);
    } catch (error) {
      failedRecipients.push({ recipient, error: error.message });
      console.error(`❌ Failed to send to ${recipient}:`, error);
    }
  }

  await prisma.emailCampaign.update({
    where: { id: campaign.id },
    data: { 
      sentAt: new Date(),
      sentCount: sentRecipients.length,
      failedCount: failedRecipients.length
    },
  });

  return { sentRecipients, failedRecipients };
}

// 🔹 Create a new campaign
export async function POST(req) {
  try {
    // Test database connection first
    await prisma.$connect();
    console.log(`✅ Database connected successfully for ${SCHOOL_NAME}`);

    const { title, subject, content, recipients, status } = await req.json();

    if (!title || !subject || !content || !recipients) {
      return NextResponse.json({ 
        success: false, 
        error: "All fields are required: title, subject, content, and recipients" 
      }, { status: 400 });
    }

    console.log(`📝 Creating campaign for ${SCHOOL_NAME}...`);
    const campaign = await prisma.emailCampaign.create({
      data: { 
        title, 
        subject, 
        content, 
        recipients, 
        status: status || "published",
        school: SCHOOL_NAME // Added school reference
      },
    });

    console.log(`✅ Campaign created for ${SCHOOL_NAME}:`, campaign.id);

    // Send emails immediately if published
    let emailResults = null;
    if (status === "published") {
      console.log(`📧 Sending emails for ${SCHOOL_NAME}...`);
      emailResults = await sendEmails(campaign);
      console.log(`✅ Emails sent successfully for ${SCHOOL_NAME}`);
    }

    return NextResponse.json({ 
      success: true, 
      campaign,
      emailResults,
      school: SCHOOL_NAME,
      message: status === "published" 
        ? `Campaign created and emails sent successfully from ${SCHOOL_NAME}` 
        : `Campaign saved as draft for ${SCHOOL_NAME}`
    });

  } catch (error) {
    console.error(`❌ POST EmailCampaign Error for ${SCHOOL_NAME}:`, error);
    
    // More specific error handling
    if (error.code === 'P2021') {
      return NextResponse.json({ 
        success: false, 
        error: "Database table not found. Please run: npx prisma db push" 
      }, { status: 500 });
    }
    
    if (error.code === 'P1001') {
      return NextResponse.json({ 
        success: false, 
        error: "Cannot connect to database. Check your DATABASE_URL" 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: false, 
      error: error.message,
      school: SCHOOL_NAME
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// 🔹 Get all campaigns
export async function GET() {
  try {
    await prisma.$connect();
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Add school information to response
    const formattedCampaigns = campaigns.map(campaign => ({
      ...campaign,
      school: SCHOOL_NAME,
      schoolLocation: SCHOOL_LOCATION,
      schoolMotto: SCHOOL_MOTTO
    }));
    
    return NextResponse.json({ 
      success: true, 
      campaigns: formattedCampaigns,
      count: campaigns.length,
      schoolInfo: {
        name: SCHOOL_NAME,
        location: SCHOOL_LOCATION,
        motto: SCHOOL_MOTTO,
        phone: CONTACT_PHONE,
        email: CONTACT_EMAIL
      }
    });
  } catch (error) {
    console.error(`❌ GET EmailCampaigns Error for ${SCHOOL_NAME}:`, error);
    return NextResponse.json({ 
      success: false, 
      error: `Failed to fetch campaigns for ${SCHOOL_NAME}`,
      school: SCHOOL_NAME
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}