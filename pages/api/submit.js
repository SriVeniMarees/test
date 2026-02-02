// pages/api/submit.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, company, phone, email, service } = req.body;

  // Validate required fields
  if (!name || !company || !phone || !email || !service) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Example: log data (replace this with sending email)
  console.log('Form submitted:', { name, company, phone, email, service });

  return res.status(200).json({ message: 'Form submitted successfully!' });
}
