import nodemailer from 'nodemailer'

interface ContactNotification {
  referenceId: string
  name: string
  email: string
  company: string
  phone: string | null
  projectType: string
  budgetRange: string
  message: string
  marketingOptIn: boolean
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendContactNotification(data: ContactNotification): Promise<boolean> {
  const toEmail = process.env.CONTACT_NOTIFICATION_EMAIL || 'support@deepxone.com'

  try {
    await transporter.sendMail({
      from: `"DeepXone Contact Form" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `New Contact Form Submission - ${data.referenceId}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Reference ID:</strong> ${data.referenceId}</p>
        <hr />
        <h3>Contact Details</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <hr />
        <h3>Project Information</h3>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        <p><strong>Budget Range:</strong> ${data.budgetRange}</p>
        <p><strong>Marketing Opt-in:</strong> ${data.marketingOptIn ? 'Yes' : 'No'}</p>
        <hr />
        <h3>Message</h3>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">
          This email was sent from the DeepXone contact form.
        </p>
      `,
      text: `
New Contact Form Submission
Reference ID: ${data.referenceId}

Contact Details
---------------
Name: ${data.name}
Email: ${data.email}
Company: ${data.company}
Phone: ${data.phone || 'Not provided'}

Project Information
-------------------
Project Type: ${data.projectType}
Budget Range: ${data.budgetRange}
Marketing Opt-in: ${data.marketingOptIn ? 'Yes' : 'No'}

Message
-------
${data.message}
      `,
    })
    return true
  } catch (error) {
    console.error('Failed to send contact notification email:', error)
    return false
  }
}

export async function sendContactConfirmation(data: ContactNotification): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"DeepXone" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `We received your inquiry - ${data.referenceId}`,
      html: `
        <h2>Thank you for contacting DeepXone</h2>
        <p>Hi ${data.name},</p>
        <p>We've received your inquiry and will get back to you within 24 hours.</p>
        <p><strong>Your Reference ID:</strong> ${data.referenceId}</p>
        <p>Please keep this reference ID for your records.</p>
        <hr />
        <h3>Summary of your inquiry</h3>
        <p><strong>Project Type:</strong> ${data.projectType}</p>
        <p><strong>Budget Range:</strong> ${data.budgetRange}</p>
        <hr />
        <p>Best regards,<br>The DeepXone Team</p>
        <p style="color: #666; font-size: 12px;">
          DeepXone Decisions™ | support@deepxone.com | 647 948 8700
        </p>
      `,
      text: `
Thank you for contacting DeepXone

Hi ${data.name},

We've received your inquiry and will get back to you within 24 hours.

Your Reference ID: ${data.referenceId}

Please keep this reference ID for your records.

Summary of your inquiry
-----------------------
Project Type: ${data.projectType}
Budget Range: ${data.budgetRange}

Best regards,
The DeepXone Team

DeepXone Decisions™ | support@deepxone.com | 647 948 8700
      `,
    })
    return true
  } catch (error) {
    console.error('Failed to send contact confirmation email:', error)
    return false
  }
}
