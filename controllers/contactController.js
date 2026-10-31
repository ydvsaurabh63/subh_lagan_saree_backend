import Contact from '../models/Contact.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Submit contact enquiry message
// @route   POST /api/contact
// @access  Public
export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
    });

    // Optional email notification to admin
    sendEmail({
      to: process.env.EMAIL_USER || 'support@subhlagansarees.com',
      subject: `New Customer Enquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h3>New Enquiry Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 10px; border-left: 3px solid #681B2C;">${message}</p>
        </div>
      `,
      text: `New contact enquiry from ${name} (${email}): ${message}`,
    }).catch(err => console.error('Enquiry email notification failed:', err));

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our team will contact you shortly.',
      contact,
    });
  } catch (error) {
    next(error);
  }
};

