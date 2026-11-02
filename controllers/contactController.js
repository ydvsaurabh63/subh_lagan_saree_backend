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

// @desc    Get all contact messages (Admin)
// @route   GET /api/contact/admin/all
// @access  Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact enquiry status (Admin)
// @route   PUT /api/contact/admin/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'responded'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Enquiry message not found' });
    }

    contact.status = status;
    await contact.save();

    res.status(200).json({
      success: true,
      message: `Enquiry marked as ${status}`,
      contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact enquiry (Admin)
// @route   DELETE /api/contact/admin/:id
// @access  Private/Admin
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


