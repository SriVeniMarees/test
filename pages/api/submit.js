// pages/api/submit.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Handle preflight CORS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, company, phone, email, service } = req.body;

    // Validate required fields
    if (!name || !company || !phone || !email || !service) {
      return res.status(400).json({
        message: 'Please fill in all required fields.'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'COR Landing Page <onboarding@resend.dev>', // your verified email
      to: [process.env.TO_EMAIL || 'tkrmanisha4s@gmail.com'],
      subject: 'New Gap Analysis Request from COR Landing Page',
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Interested In:</strong> ${service}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Submitted from: www.corcompliance.com</p>
      `,
      text: `
New Lead Submission:

Name: ${name}
Company: ${company}
Phone: ${phone}
Email: ${email}
Interested In: ${service}

---
Submitted from: www.corcompliance.com
      `.trim()
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({
        message: 'There was an error sending the email. Please try again.'
      });
    }

    // Success response
    return res.status(200).json({
      message: 'Form submitted successfully!',
      id: data?.id
    });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({
      message: 'Internal server error. Please try again later.'
    });
  }
}
