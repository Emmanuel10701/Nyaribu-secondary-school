import { NextResponse } from "next/server";
import { prisma } from "../../../../libs/prisma";
import nodemailer from 'nodemailer'; 
import { randomBytes } from "crypto";

// ====================================================================
// CONFIGURATION
// ====================================================================
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const SCHOOL_NAME = 'Nyaribu Secondary School';
const SCHOOL_LOCATION = 'Kiganjo, Nyeri County';
const SCHOOL_MOTTO = 'Soaring for Excellence';
const CONTACT_PHONE = '+254720123456';
const CONTACT_EMAIL = 'admissions@nyaribusecondary.sc.ke';

// ====================================================================
// UTILITY FUNCTIONS
// ====================================================================

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function generateApplicationNumber() {
  const year = new Date().getFullYear();
  const randomNum = randomBytes(4).toString('hex').toUpperCase();
  return `NSS/${year}/${randomNum}`;
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\s/g, '');
  const regex = /^(07|01)\d{8}$/;
  return regex.test(cleaned);
}

function getStatusLabel(status) {
  const statusMap = {
    'PENDING': 'Pending',
    'UNDER_REVIEW': 'Under Review',
    'INTERVIEW_SCHEDULED': 'Interview Scheduled',
    'INTERVIEWED': 'Interviewed',
    'ACCEPTED': 'Accepted',
    'CONDITIONAL_ACCEPTANCE': 'Conditional Acceptance',
    'WAITLISTED': 'Waitlisted',
    'REJECTED': 'Rejected',
    'WITHDRAWN': 'Withdrawn'
  };
  return statusMap[status] || status;
}

function getStreamLabel(stream) {
  const streamMap = {
    'SCIENCE': 'Science',
    'ARTS': 'Arts',
    'BUSINESS': 'Business',
    'TECHNICAL': 'Technical'
  };
  return streamMap[stream] || stream;
}

function formatDate(date) {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ====================================================================
// EMAIL TEMPLATE FUNCTIONS - RESPONSIVE VERSION
// ====================================================================

function getApplicantConfirmationTemplate(name, appNumber) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <style>
        /* RESET AND BASE */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; 
          line-height: 1.5; 
          color: #333; 
          margin: 0;
          padding: 0;
          background: #f5f7fa;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        img {
          max-width: 100%;
          height: auto;
        }
        
        a {
          text-decoration: none;
          color: inherit;
        }
        
        /* CONTAINER */
        .container { 
          max-width: 680px !important; 
          width: 100% !important;
          margin: 0 auto;
          background: white;
          overflow: hidden;
        }
        
        /* HEADER */
        .header { 
          background: linear-gradient(135deg, #1e3c72, #2a5298); 
          color: white; 
          padding: 40px 20px;
          text-align: center;
        }
        
        @media only screen and (max-width: 600px) {
          .header {
            padding: 30px 15px;
          }
        }
        
        .header h1 { 
          margin: 0 0 10px 0; 
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
        }
        
        .header h2 { 
          margin: 0; 
          font-weight: 400;
          font-size: 18px;
          opacity: 0.9;
        }
        
        @media only screen and (max-width: 600px) {
          .header h1 {
            font-size: 28px;
          }
          .header h2 {
            font-size: 16px;
          }
        }
        
        /* CONTENT */
        .content { 
          padding: 40px 30px; 
        }
        
        @media only screen and (max-width: 600px) {
          .content {
            padding: 30px 20px;
          }
        }
        
        /* SUCCESS CARD */
        .success-card {
          background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
          padding: 30px;
          margin: 25px 0;
          border-radius: 10px;
          text-align: center;
        }
        
        @media only screen and (max-width: 600px) {
          .success-card {
            padding: 25px 20px;
            margin: 20px 0;
          }
        }
        
        /* INFO GRID */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        
        @media only screen and (max-width: 600px) {
          .info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
        
        .info-box {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        @media only screen and (max-width: 600px) {
          .info-box {
            padding: 15px;
          }
        }
        
        /* NEXT STEPS */
        .next-steps {
          background: #e3f2fd;
          padding: 25px;
          border-radius: 10px;
          margin: 25px 0;
        }
        
        @media only screen and (max-width: 600px) {
          .next-steps {
            padding: 20px;
            margin: 20px 0;
          }
        }
        
        /* CONTACT INFO */
        .contact-info {
          background: linear-gradient(135deg, #f0f7ff, #dbeafe);
          padding: 30px;
          border-radius: 10px;
          margin-top: 30px;
          text-align: center;
        }
        
        @media only screen and (max-width: 600px) {
          .contact-info {
            padding: 25px 20px;
            margin-top: 25px;
          }
        }
        
        /* FOOTER */
        .footer { 
          background: #1a1a2e; 
          color: #b0b0b0;
          padding: 30px 20px;
          text-align: center;
          font-size: 14px;
        }
        
        @media only screen and (max-width: 600px) {
          .footer {
            padding: 25px 15px;
            font-size: 13px;
          }
        }
        
        /* TYPOGRAPHY */
        .text-large {
          font-size: 24px;
          font-weight: 700;
          color: #1e3c72;
          margin: 10px 0;
        }
        
        @media only screen and (max-width: 600px) {
          .text-large {
            font-size: 20px;
          }
        }
        
        .text-medium {
          font-size: 18px;
          color: #333;
          margin: 15px 0;
        }
        
        @media only screen and (max-width: 600px) {
          .text-medium {
            font-size: 16px;
          }
        }
        
        .text-small {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        
        /* BADGE */
        .badge {
          display: inline-block;
          background: #4caf50;
          color: white;
          padding: 10px 25px;
          border-radius: 50px;
          font-weight: 600;
          margin: 10px 0;
          font-size: 16px;
        }
        
        @media only screen and (max-width: 600px) {
          .badge {
            padding: 8px 20px;
            font-size: 14px;
          }
        }
        
        /* LISTS */
        .steps-list {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }
        
        .steps-list li {
          padding: 15px 0;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
        }
        
        .steps-list li:last-child {
          border-bottom: none;
        }
        
        .steps-list span:first-child {
          margin-right: 15px;
          font-size: 24px;
          min-width: 40px;
        }
        
        @media only screen and (max-width: 600px) {
          .steps-list li {
            padding: 12px 0;
          }
          .steps-list span:first-child {
            font-size: 20px;
            margin-right: 12px;
            min-width: 35px;
          }
        }
        
        /* CONTACT ITEMS */
        .contact-items {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          margin: 20px 0;
        }
        
        @media only screen and (max-width: 600px) {
          .contact-items {
            gap: 20px;
          }
        }
        
        .contact-item {
          text-align: center;
          min-width: 120px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ APPLICATION RECEIVED</h1>
          <h2>${SCHOOL_NAME}</h2>
        </div>
        
        <div class="content">
          <div class="success-card">
            <div style="font-size: 64px; margin-bottom: 15px;">🎉</div>
            <span class="badge">Application Submitted Successfully!</span>
            <h3 style="color: #2e7d32; margin: 15px 0; font-size: 24px;">
              Welcome to ${SCHOOL_NAME} Admissions
            </h3>
          </div>
          
          <p class="text-medium">
            Dear <strong style="color: #1e3c72;">${name}</strong>,
            <br><br>
            Thank you for choosing ${SCHOOL_NAME} for your secondary education journey. 
            We have successfully received your admission application and it is now under review.
          </p>
          
          <div class="info-grid">
            <div class="info-box">
              <p class="text-small">Applicant Name</p>
              <p class="text-large">${name}</p>
            </div>
            <div class="info-box">
              <p class="text-small">Application Number</p>
              <p class="text-large">${appNumber}</p>
            </div>
          </div>
          
          <div class="next-steps">
            <h4 style="color: #1e3c72; margin-top: 0; font-size: 20px;">📋 What Happens Next?</h4>
            <ul class="steps-list">
              <li>
                <span>🔍</span>
                <span><strong>Application Review:</strong> Our admissions team will review your application within 7-14 working days</span>
              </li>
              <li>
                <span>📧</span>
                <span><strong>Status Updates:</strong> You will receive email notifications at every stage of the process</span>
              </li>
              <li>
                <span>📞</span>
                <span><strong>Verification:</strong> We may contact you for additional information or clarification</span>
              </li>
              <li>
                <span>🎯</span>
                <span><strong>Decision:</strong> Final admission decision will be communicated via email</span>
              </li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #ff9800;">
            <h4 style="color: #d35400; margin-top: 0; font-size: 18px;">⚠️ Important Notes</h4>
            <p class="text-medium">
              • Keep your application number (<strong>${appNumber}</strong>) safe for future reference<br>
              • All communications will be sent to this email address<br>
              • Do not share your application details with unauthorized persons<br>
              • Application review typically takes 2-3 weeks
            </p>
          </div>
          
          <div class="contact-info">
            <h4 style="color: #1e3c72; margin-top: 0; font-size: 20px;">📞 Need Help?</h4>
            <p class="text-medium">
              Our admissions team is here to assist you:
            </p>
            <div class="contact-items">
              <div class="contact-item">
                <div style="font-size: 24px; margin-bottom: 8px;">📱</div>
                <p style="margin: 0; font-weight: 600;">${CONTACT_PHONE}</p>
                <p class="text-small">Call Us</p>
              </div>
              <div class="contact-item">
                <div style="font-size: 24px; margin-bottom: 8px;">📧</div>
                <p style="margin: 0; font-weight: 600;">${CONTACT_EMAIL}</p>
                <p class="text-small">Email Us</p>
              </div>
              <div class="contact-item">
                <div style="font-size: 24px; margin-bottom: 8px;">🏫</div>
                <p style="margin: 0; font-weight: 600;">${SCHOOL_LOCATION}</p>
                <p class="text-small">Visit Us</p>
              </div>
            </div>
            <p style="margin-top: 20px; font-size: 14px; color: #666;">
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
            <p style="font-size: 18px; color: #1e3c72; font-weight: 600;">
              We look forward to reviewing your application!
            </p>
            <p style="margin-top: 15px; font-size: 16px;">
              Best regards,<br>
              <strong>The Admissions Team</strong><br>
              ${SCHOOL_NAME}
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 15px;">
            <p style="font-size: 20px; color: #fff; margin: 0 0 10px 0;">${SCHOOL_NAME}</p>
            <p style="margin: 0 0 8px 0;">${SCHOOL_LOCATION}</p>
            <p style="margin: 0 0 15px 0; font-style: italic;">"${SCHOOL_MOTTO}"</p>
          </div>
          <div style="margin-bottom: 15px;">
            <a href="mailto:${CONTACT_EMAIL}" style="margin: 0 10px; color: #667eea;">Email Us</a>
            <a href="tel:${CONTACT_PHONE}" style="margin: 0 10px; color: #667eea;">Call Us</a>
            <a href="#" style="margin: 0 10px; color: #667eea;">Visit Website</a>
          </div>
          <p style="color: #888; margin: 0; font-size: 12px;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.<br>
            This is an automated confirmation email. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getAdminNotificationTemplate(applicantData, applicationNumber) {
  const age = calculateAge(applicantData.dateOfBirth);
  const kcpeMarks = applicantData.kcpeMarks || 'Not provided';
  const formattedDate = formatDate(new Date());
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <style>
        /* RESET AND BASE */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; 
          line-height: 1.5; 
          color: #333; 
          margin: 0;
          padding: 0;
          background: #f5f7fa;
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        
        img {
          max-width: 100%;
          height: auto;
        }
        
        /* CONTAINER */
        .container { 
          max-width: 700px !important; 
          width: 100% !important;
          margin: 0 auto;
          background: white;
          overflow: hidden;
        }
        
        /* HEADER */
        .header { 
          background: linear-gradient(135deg, #c0392b, #e74c3c); 
          color: white; 
          padding: 30px 20px;
          text-align: center;
        }
        
        @media only screen and (max-width: 600px) {
          .header {
            padding: 25px 15px;
          }
        }
        
        .header h1 { 
          margin: 0 0 10px 0; 
          font-size: 28px;
          font-weight: 700;
        }
        
        .header h2 { 
          margin: 0; 
          font-weight: 400;
          font-size: 16px;
          opacity: 0.9;
        }
        
        /* ALERT BANNER */
        .alert-banner {
          background: #fff3cd;
          border-left: 5px solid #ffc107;
          padding: 20px;
          margin: 0;
          text-align: center;
        }
        
        @media only screen and (max-width: 600px) {
          .alert-banner {
            padding: 15px;
          }
        }
        
        /* CONTENT */
        .content { 
          padding: 30px; 
        }
        
        @media only screen and (max-width: 600px) {
          .content {
            padding: 20px;
          }
        }
        
        /* APPLICATION INFO */
        .app-info {
          background: linear-gradient(135deg, #f0f7ff, #dbeafe);
          padding: 25px;
          border-radius: 10px;
          margin: 20px 0;
        }
        
        @media only screen and (max-width: 600px) {
          .app-info {
            padding: 20px;
          }
        }
        
        /* DETAILS TABLE */
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        .details-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .details-table tr:last-child td {
          border-bottom: none;
        }
        
        .details-table td:first-child {
          font-weight: 600;
          color: #1e3c72;
          width: 40%;
        }
        
        @media only screen and (max-width: 600px) {
          .details-table {
            display: block;
          }
          .details-table tr {
            display: block;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e9ecef;
          }
          .details-table tr:last-child {
            border-bottom: none;
          }
          .details-table td {
            display: block;
            width: 100% !important;
            padding: 8px 0;
            border-bottom: none;
          }
          .details-table td:first-child {
            font-weight: 600;
            color: #1e3c72;
            margin-top: 10px;
          }
        }
        
        /* ACTION BOX */
        .action-box {
          background: #e8f5e9;
          border: 2px solid #4caf50;
          padding: 25px;
          border-radius: 10px;
          margin: 25px 0;
          text-align: center;
        }
        
        @media only screen and (max-width: 600px) {
          .action-box {
            padding: 20px;
          }
        }
        
        /* FOOTER */
        .footer { 
          background: #2c3e50; 
          color: #b0b0b0;
          padding: 25px 20px;
          text-align: center;
          font-size: 14px;
        }
        
        @media only screen and (max-width: 600px) {
          .footer {
            padding: 20px 15px;
            font-size: 13px;
          }
        }
        
        /* TYPOGRAPHY */
        .text-large {
          font-size: 22px;
          font-weight: 700;
          color: #1e3c72;
          margin: 10px 0;
        }
        
        @media only screen and (max-width: 600px) {
          .text-large {
            font-size: 20px;
          }
        }
        
        .text-medium {
          font-size: 16px;
          color: #333;
          margin: 15px 0;
        }
        
        .text-small {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        
        /* BADGE */
        .badge {
          display: inline-block;
          background: #2196f3;
          color: white;
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: 600;
          margin: 10px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 NEW APPLICATION SUBMITTED</h1>
          <h2>${SCHOOL_NAME} Admissions System</h2>
        </div>
        
        <div class="alert-banner">
          <span class="badge">ACTION REQUIRED</span>
          <p style="margin: 10px 0 0 0; font-weight: 600; color: #856404;">
            A new student application requires review in the admissions portal
          </p>
        </div>
        
        <div class="content">
          <div class="app-info">
            <h3 style="color: #1e3c72; margin-top: 0; font-size: 22px; text-align: center;">
              Application: ${applicationNumber}
            </h3>
            <div style="text-align: center;">
              <p class="text-large">${applicantData.firstName} ${applicantData.lastName}</p>
              <p class="text-medium">Submitted: ${formattedDate}</p>
            </div>
          </div>
          
          <h4 style="color: #2c3e50; margin-top: 0; font-size: 18px;">📋 Application Details</h4>
          <table class="details-table">
            <tr>
              <td>Applicant Name:</td>
              <td>${applicantData.firstName} ${applicantData.middleName || ''} ${applicantData.lastName}</td>
            </tr>
            <tr>
              <td>Date of Birth:</td>
              <td>${formatDate(applicantData.dateOfBirth)} (Age: ${age})</td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>${applicantData.gender}</td>
            </tr>
            <tr>
              <td>Nationality:</td>
              <td>${applicantData.nationality}</td>
            </tr>
            <tr>
              <td>County:</td>
              <td>${applicantData.county}</td>
            </tr>
            <tr>
              <td>Preferred Stream:</td>
              <td>${getStreamLabel(applicantData.preferredStream)}</td>
            </tr>
            <tr>
              <td>Previous School:</td>
              <td>${applicantData.previousSchool}</td>
            </tr>
            <tr>
              <td>KCPE Marks:</td>
              <td>${kcpeMarks}</td>
            </tr>
            <tr>
              <td>Contact Email:</td>
              <td>${applicantData.email}</td>
            </tr>
            <tr>
              <td>Contact Phone:</td>
              <td>${applicantData.phone}</td>
            </tr>
          </table>
          
          <div class="action-box">
            <h4 style="color: #2e7d32; margin-top: 0; font-size: 20px;">✅ Next Steps</h4>
            <ol style="text-align: left; margin: 15px 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Review application completeness</li>
              <li style="margin-bottom: 10px;">Verify academic credentials</li>
              <li style="margin-bottom: 10px;">Check for any missing documents</li>
              <li style="margin-bottom: 10px;">Update application status in portal</li>
              <li>Schedule interview if required</li>
            </ol>
            <p style="margin-top: 15px; font-weight: 600;">
              ⏰ Please process within 48 hours
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1e3c72; margin-top: 0; font-size: 18px;">📊 School Statistics</h4>
            <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 15px;">
              <div style="text-align: center; margin: 10px;">
                <p style="font-size: 24px; font-weight: 700; color: #1e3c72; margin: 0;">400+</p>
                <p style="font-size: 12px; color: #666; margin: 5px 0;">Total Students</p>
              </div>
              <div style="text-align: center; margin: 10px;">
                <p style="font-size: 24px; font-weight: 700; color: #1e3c72; margin: 0;">4</p>
                <p style="font-size: 12px; color: #666; margin: 5px 0;">Streams</p>
              </div>
              <div style="text-align: center; margin: 10px;">
                <p style="font-size: 24px; font-weight: 700; color: #1e3c72; margin: 0;">98%</p>
                <p style="font-size: 12px; color: #666; margin: 5px 0;">Transition Rate</p>
              </div>
            </div>
          </div>
          
          <p style="text-align: center; margin-top: 25px; font-size: 14px; color: #666;">
            <strong>School Information:</strong><br>
            ${SCHOOL_NAME} | ${SCHOOL_LOCATION}<br>
            Phone: ${CONTACT_PHONE} | Email: ${CONTACT_EMAIL}<br>
            Motto: "${SCHOOL_MOTTO}"
          </p>
        </div>
        
        <div class="footer">
          <p style="font-size: 16px; color: #fff; margin: 0 0 10px 0; font-weight: 600;">
            ${SCHOOL_NAME} Admissions Portal
          </p>
          <p style="margin: 5px 0; font-size: 12px;">
            This is an automated notification from the admissions system.<br>
            Please log in to the portal to take action.
          </p>
          <p style="margin: 15px 0 0 0; font-size: 11px; color: #888;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getStatusUpdateTemplate(application, newStatus, updateData = {}) {
  const statusLabel = getStatusLabel(newStatus);
  const applicantName = `${application.firstName} ${application.lastName}`;
  const applicationNumber = application.applicationNumber;
  
  let subjectIcon = '';
  let title = '';
  let message = '';
  let actionSection = '';
  
  switch (newStatus) {
    case 'ACCEPTED':
      subjectIcon = '🎉';
      title = 'Congratulations! Admission Offer';
      message = `We are pleased to inform you that your application to ${SCHOOL_NAME} has been <strong>ACCEPTED</strong>. Welcome to our school community!`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h4 style="color: #2e7d32; margin-top: 0; font-size: 18px;">✅ Next Steps to Complete Admission:</h4>
          <ol style="margin: 15px 0 0 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Complete the admission acceptance form</li>
            <li style="margin-bottom: 8px;">Submit all required documents (Birth Certificate, KCPE Certificate, etc.)</li>
            <li style="margin-bottom: 8px;">Pay admission fees as per fee structure</li>
            <li>Report on: <strong>${updateData.reportingDate ? formatDate(updateData.reportingDate) : 'To be communicated'}</strong></li>
          </ol>
          ${updateData.assignedStream ? `<p style="margin-top: 15px;"><strong>Assigned Stream:</strong> ${getStreamLabel(updateData.assignedStream)}</p>` : ''}
          ${updateData.admissionClass ? `<p><strong>Class:</strong> ${updateData.admissionClass}</p>` : ''}
        </div>
      `;
      break;
      
    case 'REJECTED':
      subjectIcon = '📄';
      title = 'Application Status Update';
      message = `After careful review, we regret to inform you that your application to ${SCHOOL_NAME} has not been successful at this time.`;
      actionSection = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
          <h4 style="color: #343a40; margin-top: 0; font-size: 16px;">Application Feedback:</h4>
          <p><strong>Reason:</strong> ${updateData.rejectionReason || 'Application did not meet the admission criteria at this time.'}</p>
          ${updateData.alternativeSuggestions ? `<p><strong>Suggestions:</strong> ${updateData.alternativeSuggestions}</p>` : ''}
          ${updateData.decisionNotes ? `<p><strong>Notes:</strong> ${updateData.decisionNotes}</p>` : ''}
        </div>
      `;
      break;
      
    case 'INTERVIEW_SCHEDULED':
      subjectIcon = '📅';
      title = 'Interview Scheduled';
      message = `Your application to ${SCHOOL_NAME} has progressed to the interview stage. We would like to invite you for an interview.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #f3e5f5, #e1bee7); padding: 25px; border-radius: 10px; margin: 20px 0;">
          <h4 style="color: #7b1fa2; margin-top: 0; font-size: 18px;">📅 Interview Details:</h4>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">Date</p>
              <p style="margin: 0; font-weight: 600; color: #333;">${updateData.interviewDate ? formatDate(updateData.interviewDate) : 'To be confirmed'}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">Time</p>
              <p style="margin: 0; font-weight: 600; color: #333;">${updateData.interviewTime || 'To be confirmed'}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; grid-column: span 2;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #666;">Venue</p>
              <p style="margin: 0; font-weight: 600; color: #333;">${updateData.interviewVenue || 'Main Administration Building, ' + SCHOOL_LOCATION}</p>
            </div>
          </div>
          <p style="margin-top: 15px; font-size: 14px; color: #666;">
            <strong>Please bring:</strong> Original documents, parents/guardian if under 18, and any relevant certificates.
          </p>
        </div>
      `;
      break;
      
    case 'WAITLISTED':
      subjectIcon = '⏳';
      title = 'Application Waitlisted';
      message = `Your application to ${SCHOOL_NAME} has been placed on a <strong>WAITLIST</strong>. We will contact you if a space becomes available.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="color: #1565c0; margin-top: 0; font-size: 16px;">Waitlist Information:</h4>
          <p><strong>Position:</strong> ${updateData.waitlistPosition || 'Not specified'}</p>
          ${updateData.waitlistNotes ? `<p><strong>Notes:</strong> ${updateData.waitlistNotes}</p>` : ''}
          <p style="margin-top: 10px; font-size: 14px;">
            We will contact you immediately if a space becomes available. You may check your status periodically.
          </p>
        </div>
      `;
      break;
      
    case 'CONDITIONAL_ACCEPTANCE':
      subjectIcon = '📝';
      title = 'Conditional Admission Offer';
      message = `Your application to ${SCHOOL_NAME} has received a <strong>CONDITIONAL ACCEPTANCE</strong>. Please review the conditions below.`;
      actionSection = `
        <div style="background: linear-gradient(135deg, #fff3cd, #ffeaa7); padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #ffc107;">
          <h4 style="color: #d35400; margin-top: 0; font-size: 18px;">📋 Conditions to Fulfill:</h4>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 15px;">
            <p>${updateData.conditions || 'Please contact the admissions office for specific conditions.'}</p>
          </div>
          ${updateData.conditionDeadline ? `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0; font-weight: 600;">⏰ Deadline: ${formatDate(updateData.conditionDeadline)}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px;">All conditions must be met by this date to secure your admission.</p>
            </div>
          ` : ''}
        </div>
      `;
      break;
      
    default:
      subjectIcon = '📧';
      title = 'Application Status Update';
      message = `Your application status has been updated to: <strong>${statusLabel}</strong>.`;
      actionSection = updateData.decisionNotes ? `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Notes:</strong> ${updateData.decisionNotes}</p>
        </div>
      ` : '';
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="x-apple-disable-message-reformatting">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.5; color: #333; margin: 0; padding: 0; background: #f5f7fa;
          -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;
        }
        .container { max-width: 680px; width: 100%; margin: 0 auto; background: white; overflow: hidden; }
        .header { background: linear-gradient(135deg, #1e3c72, #2a5298); color: white; padding: 40px 20px; text-align: center; }
        .content { padding: 40px 30px; }
        .status-card { background: linear-gradient(135deg, #f0f7ff, #dbeafe); padding: 30px; border-radius: 10px; margin: 20px 0; }
        .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; }
        .contact-info { background: #e3f2fd; padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center; }
        .footer { background: #1a1a2e; color: #b0b0b0; padding: 30px 20px; text-align: center; font-size: 14px; }
        @media only screen and (max-width: 600px) {
          .header, .content { padding: 30px 15px; }
          .info-grid { grid-template-columns: 1fr; }
          .status-card, .contact-info { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${subjectIcon} ${title}</h1>
          <h2>${SCHOOL_NAME}</h2>
        </div>
        
        <div class="content">
          <div class="status-card">
            <h3 style="color: #1e3c72; margin-top: 0; font-size: 22px; text-align: center;">
              Status: ${statusLabel}
            </h3>
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">
              ${message}
            </p>
          </div>
          
          <div class="info-grid">
            <div class="info-box">
              <p style="font-size: 14px; color: #666; margin: 0 0 5px 0;">Applicant Name</p>
              <p style="font-size: 18px; font-weight: 600; color: #1e3c72; margin: 0;">${applicantName}</p>
            </div>
            <div class="info-box">
              <p style="font-size: 14px; color: #666; margin: 0 0 5px 0;">Application Number</p>
              <p style="font-size: 18px; font-weight: 600; color: #1e3c72; margin: 0;">${applicationNumber}</p>
            </div>
          </div>
          
          ${actionSection}
          
          <div class="contact-info">
            <h4 style="color: #1e3c72; margin-top: 0; font-size: 18px;">📞 Need Assistance?</h4>
            <p>Our admissions team is here to help:</p>
            <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap; margin: 20px 0;">
              <div style="text-align: center;">
                <p style="margin: 0; font-weight: 600;">${CONTACT_PHONE}</p>
                <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Call Us</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0; font-weight: 600;">${CONTACT_EMAIL}</p>
                <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Email Us</p>
              </div>
              <div style="text-align: center;">
                <p style="margin: 0; font-weight: 600;">${SCHOOL_LOCATION}</p>
                <p style="font-size: 14px; color: #666; margin: 5px 0 0 0;">Visit Us</p>
              </div>
            </div>
            <p style="margin-top: 15px; font-size: 14px; color: #666;">
              Office Hours: Monday - Friday, 8:00 AM - 5:00 PM
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e9ecef;">
            <p style="font-size: 18px; color: #1e3c72; font-weight: 600;">
              Thank you for your interest in ${SCHOOL_NAME}
            </p>
            <p style="margin-top: 15px; font-size: 16px;">
              Best regards,<br>
              <strong>The Admissions Team</strong><br>
              ${SCHOOL_NAME}
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div style="margin-bottom: 15px;">
            <p style="font-size: 20px; color: #fff; margin: 0 0 10px 0;">${SCHOOL_NAME}</p>
            <p style="margin: 0 0 8px 0;">${SCHOOL_LOCATION}</p>
            <p style="margin: 0 0 15px 0; font-style: italic;">"${SCHOOL_MOTTO}"</p>
          </div>
          <p style="color: #888; margin: 0; font-size: 12px;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. All rights reserved.<br>
            This is an automated email. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function getDeletionNotificationTemplate(application, deletedBy) {
  const applicantName = `${application.firstName} ${application.lastName}`;
  const applicationNumber = application.applicationNumber;
  const deletionDate = formatDate(new Date());
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px; }
        .alert-box { background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #343a40; color: #b0b0b0; padding: 20px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0 0 10px 0;">🗑️ Application Deleted</h1>
          <p style="margin: 0; opacity: 0.9;">${SCHOOL_NAME}</p>
        </div>
        
        <div class="content">
          <div class="alert-box">
            <h3 style="color: #721c24; margin-top: 0; font-size: 18px;">⚠️ Application Record Deleted</h3>
            <p style="margin: 10px 0 0 0; color: #721c24;">
              An application record has been permanently deleted from the admissions system.
            </p>
          </div>
          
          <div class="info-box">
            <h4 style="color: #495057; margin-top: 0; font-size: 16px;">Deleted Application Details:</h4>
            <p><strong>Applicant:</strong> ${applicantName}</p>
            <p><strong>Application Number:</strong> ${applicationNumber}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Deleted On:</strong> ${deletionDate}</p>
            <p><strong>Deleted By:</strong> ${deletedBy}</p>
            <p><strong>Reason:</strong> Application record permanently removed from database</p>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #495057; font-size: 14px;">
              <strong>Note:</strong> This deletion is permanent and cannot be undone. 
              All associated data has been removed from the system.
            </p>
          </div>
          
          <p style="text-align: center; margin-top: 25px; color: #6c757d;">
            This is an automated notification from the ${SCHOOL_NAME} Admissions System.
          </p>
        </div>
        
        <div class="footer">
          <p style="margin: 0 0 10px 0; font-size: 14px; color: #fff;">${SCHOOL_NAME}</p>
          <p style="margin: 0 0 5px 0;">${SCHOOL_LOCATION}</p>
          <p style="margin: 0; font-style: italic; font-size: 11px;">"${SCHOOL_MOTTO}"</p>
          <p style="margin: 15px 0 0 0; color: #888; font-size: 10px;">
            © ${new Date().getFullYear()} ${SCHOOL_NAME}. Confidential - For internal use only.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ====================================================================
// POST HANDLER - CREATE APPLICATION
// ====================================================================





// ====================================================================
// PATCH HANDLER - UPDATE APPLICATION
// ====================================================================

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    const data = await req.json();
    
    // Check if application exists
    const existingApplication = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!existingApplication) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      updatedAt: new Date(),
    };

    // Update basic fields if provided
    if (data.firstName) updateData.firstName = data.firstName.trim();
    if (data.lastName) updateData.lastName = data.lastName.trim();
    if (data.middleName !== undefined) updateData.middleName = data.middleName?.trim();
    if (data.gender) updateData.gender = data.gender;
    if (data.dateOfBirth) updateData.dateOfBirth = new Date(data.dateOfBirth);
    if (data.email) updateData.email = data.email.trim().toLowerCase();
    if (data.phone) updateData.phone = data.phone.replace(/\s/g, '');
    if (data.preferredStream) updateData.preferredStream = data.preferredStream;
    
    // Update status and related fields
    if (data.status) {
      updateData.status = data.status;
      
      // Handle status-specific updates
      if (data.status === 'ACCEPTED' || data.status === 'CONDITIONAL_ACCEPTANCE') {
        updateData.decisionDate = new Date();
        updateData.admissionOfficer = data.admissionOfficer || 'System';
        if (data.decisionNotes) updateData.decisionNotes = data.decisionNotes;
        
        if (data.assignedStream) updateData.assignedStream = data.assignedStream;
        if (data.admissionClass) updateData.admissionClass = data.admissionClass;
        if (data.houseAssigned) updateData.houseAssigned = data.houseAssigned;
        if (data.reportingDate) updateData.reportingDate = new Date(data.reportingDate);
        if (data.admissionDate) updateData.admissionDate = new Date(data.admissionDate);
        
        if (data.status === 'CONDITIONAL_ACCEPTANCE') {
          if (data.conditions) updateData.conditions = data.conditions;
          if (data.conditionDeadline) updateData.conditionDeadline = new Date(data.conditionDeadline);
        }
      }
      
      else if (data.status === 'REJECTED') {
        updateData.rejectionDate = new Date();
        updateData.rejectionReason = data.rejectionReason || null;
        updateData.alternativeSuggestions = data.alternativeSuggestions || null;
        updateData.decisionNotes = data.decisionNotes || null;
        updateData.admissionOfficer = data.admissionOfficer || 'System';
      }
      
      else if (data.status === 'WAITLISTED') {
        updateData.waitlistPosition = data.waitlistPosition || null;
        updateData.waitlistNotes = data.waitlistNotes || null;
        updateData.decisionNotes = data.decisionNotes || null;
        updateData.admissionOfficer = data.admissionOfficer || 'System';
      }
      
      else if (data.status === 'INTERVIEW_SCHEDULED' || data.status === 'INTERVIEWED') {
        if (data.interviewDate) updateData.interviewDate = new Date(data.interviewDate);
        if (data.interviewTime) updateData.interviewTime = data.interviewTime;
        if (data.interviewVenue) updateData.interviewVenue = data.interviewVenue;
        if (data.interviewNotes) updateData.interviewNotes = data.interviewNotes;
        updateData.admissionOfficer = data.admissionOfficer || 'System';
        
        if (data.status === 'INTERVIEWED') {
          updateData.decisionNotes = data.decisionNotes || null;
        }
      }
    }

    // Update other fields
    if (data.decisionNotes !== undefined) updateData.decisionNotes = data.decisionNotes;
    if (data.admissionOfficer !== undefined) updateData.admissionOfficer = data.admissionOfficer;
    if (data.documentsVerified !== undefined) updateData.documentsVerified = data.documentsVerified;
    if (data.documentsNotes !== undefined) updateData.documentsNotes = data.documentsNotes;

    // Update the application
    const updatedApplication = await prisma.admissionApplication.update({
      where: { id },
      data: updateData,
    });

    // Send status update email if status changed
    if (data.status && data.status !== existingApplication.status) {
      try {
        const mailOptions = {
          from: {
            name: `${SCHOOL_NAME} Admissions`,
            address: process.env.EMAIL_USER
          },
          to: updatedApplication.email,
          subject: `Application Status Update: ${SCHOOL_NAME}`,
          html: getStatusUpdateTemplate(updatedApplication, data.status, data)
        };
        
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.warn("Status update email failed:", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application updated successfully`,
      data: {
        id: updatedApplication.id,
        applicationNumber: updatedApplication.applicationNumber,
        name: `${updatedApplication.firstName} ${updatedApplication.lastName}`,
        status: getStatusLabel(updatedApplication.status),
        updatedAt: updatedApplication.updatedAt,
      }
    });

  } catch (error) {
    console.error("Update error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ====================================================================
// DELETE HANDLER - DELETE APPLICATION
// ====================================================================

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const id = pathSegments[pathSegments.length - 1];
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Check if application exists
    const application = await prisma.admissionApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }

    // Get the user who is deleting (from request headers or body)
    const data = await req.json().catch(() => ({}));
    const deletedBy = data.deletedBy || 'System Administrator';
    const reason = data.reason || 'Administrative action';

    // Store application data before deletion for notification
    const applicationData = { ...application };

    // Delete the application
    await prisma.admissionApplication.delete({
      where: { id }
    });

    // Send deletion notification to admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        const deletionMailOptions = {
          from: {
            name: `${SCHOOL_NAME} Admissions System`,
            address: process.env.EMAIL_USER
          },
          to: adminEmail,
          subject: `🗑️ APPLICATION DELETED: ${applicationData.firstName} ${applicationData.lastName} (${applicationData.applicationNumber})`,
          html: getDeletionNotificationTemplate(applicationData, deletedBy)
        };
        
        await transporter.sendMail(deletionMailOptions);
      }
    } catch (emailError) {
      console.warn("Deletion notification email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: `Application deleted successfully`,
      data: {
        applicationNumber: applicationData.applicationNumber,
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        deletedAt: new Date().toISOString(),
        deletedBy: deletedBy,
        reason: reason
      }
    });

  } catch (error) {
    console.error("Delete error:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to delete application",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}