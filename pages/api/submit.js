// pages/api/submit.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, company, phone, email, service } = req.body;

    if (!name || !company || !phone || !email || !service) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'COR Landing Page <onboarding@resend.dev>',
      to: [process.env.TO_EMAIL || 'tkrmanisha4s@gmail.com'],
      subject: 'New Gap Analysis Request from COR Landing Page',
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Company: ${company}</p><p>Phone: ${phone}</p><p>Service: ${service}</p>`,
    });

    if (error) throw error;

    return res.status(200).json({ message: 'Form submitted successfully!' });

  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ message: 'Internal server error. Try again later.' });
  }
}
