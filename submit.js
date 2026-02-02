import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { name, company, phone, email, service } = req.body;

        // Validate required fields
        if (!name || !company || !phone || !email || !service) {
            return res.status(400).json({
                error: 'Missing required fields',
                message: 'Please fill in all required fields.'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email',
                message: 'Please enter a valid email address.'
            });
        }

        // Send email using Resend
        const { data, error } = await resend.emails.send({
            from: 'COR Landing Page <onboarding@resend.dev>', // You'll need to update this with your verified domain
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
                error: 'Failed to send email',
                message: 'There was an error processing your request. Please try again or contact us directly.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Form submitted successfully!',
            id: data?.id
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred. Please try again later.'
        });
    }
}
