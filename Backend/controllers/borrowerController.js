const Borrower = require('../models/Borrower');

const BorrowerController = {
  async getBorrowers(req, res) {
    try {
      const lenderId = req.user.id; // From JWT middleware
      const borrowers = await Borrower.findByLenderId(lenderId);
      res.status(200).json(borrowers);
    } catch (error) {
      console.error('Error fetching borrowers:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch borrowers' });
    }
  },

  async createBorrower(req, res) {
    try {
      const lenderId = req.user.id;
      const {
        first_name, last_name, email, phone_number,
        aadhar_number, pan_number, date_of_birth, address
      } = req.body;

      if (!first_name || !last_name || !email) {
        return res.status(400).json({ error: 'First name, last name, and email are required' });
      }

      const borrowerData = {
        id: require('uuid').v4(),
        lender_id: lenderId,
        first_name,
        last_name,
        email,
        phone_number,
        aadhar_number,
        pan_number,
        date_of_birth,
        address
      };

      const newBorrower = await Borrower.create(borrowerData);
      res.status(201).json({
        message: 'Borrower created successfully',
        borrower: newBorrower
      });
    } catch (error) {
      console.error('Error creating borrower:', error);
      res.status(500).json({ error: error.message || 'Failed to create borrower' });
    }
  },

  async getBorrower(req, res) {
    try {
      const { id } = req.params;
      const borrower = await Borrower.findById(id);

      if (!borrower || borrower.lender_id !== req.user.id) {
        return res.status(404).json({ error: 'Borrower not found or unauthorized' });
      }

      res.status(200).json(borrower);
    } catch (error) {
      console.error('Error fetching borrower:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch borrower' });
    }
  },

  async updateBorrower(req, res) {
    try {
      const { id } = req.params;
      const borrower = await Borrower.findById(id);

      if (!borrower || borrower.lender_id !== req.user.id) {
        return res.status(404).json({ error: 'Borrower not found or unauthorized' });
      }

      const updatedBorrower = await Borrower.update(id, req.body);
      res.status(200).json({
        message: 'Borrower updated successfully',
        borrower: updatedBorrower
      });
    } catch (error) {
      console.error('Error updating borrower:', error);
      res.status(500).json({ error: error.message || 'Failed to update borrower' });
    }
  },

  async deleteBorrower(req, res) {
    try {
      const { id } = req.params;
      const borrower = await Borrower.findById(id);

      if (!borrower || borrower.lender_id !== req.user.id) {
        return res.status(404).json({ error: 'Borrower not found or unauthorized' });
      }

      await Borrower.delete(id);
      res.status(200).json({ message: 'Borrower deleted successfully' });
    } catch (error) {
      console.error('Error deleting borrower:', error);
      res.status(500).json({ error: error.message || 'Failed to delete borrower' });
    }
  }
};

module.exports = BorrowerController;
