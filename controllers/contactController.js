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

    const activeStoreSlug = (req.body.storeSlug || req.headers['x-store-slug'] || 'subh-lagan').toLowerCase().trim();
    const activeStoreName = req.body.storeName || (activeStoreSlug === 'arun-vastralay' ? 'Arun Vastralay' : activeStoreSlug === 'veeraj-brand-seller' ? 'Veeraj Brand Seller' : 'Subh Lagan Sarees');

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      storeSlug: activeStoreSlug,
      storeName: activeStoreName,
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
    const query = {};

    // Store isolation for clients
    if (req.user && (req.user.role === 'client' || (req.user.role === 'admin' && req.user.storeName))) {
      const userStoreSlug = req.user.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      query.storeSlug = userStoreSlug;
    } else if (req.query.store && req.query.store !== 'all') {
      query.storeSlug = req.query.store.toLowerCase().trim();
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });
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

    // Role check: client can only modify enquiries from their store
    if (req.user && req.user.role === 'client' && req.user.storeName) {
      const userStoreSlug = req.user.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      if (contact.storeSlug && contact.storeSlug !== userStoreSlug) {
        return res.status(403).json({ success: false, message: 'Not authorized to manage another store\'s enquiry' });
      }
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

    // Role check: client can only delete enquiries from their store
    if (req.user && req.user.role === 'client' && req.user.storeName) {
      const userStoreSlug = req.user.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      if (contact.storeSlug && contact.storeSlug !== userStoreSlug) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete another store\'s enquiry' });
      }
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


