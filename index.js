const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 3455;
const cors = require('cors');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'access_work',
  password: 'anny',
});

app.use(express.json());
app.use(cors());

// GET ALL DONORS
app.get('/api/donors/all', async (req, res) => {
  try {
    const queryText = 'SELECT * FROM donors;';
    const donors = await pool.query(queryText);
    res.status(201).send(donors.rows);
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).send('Internal server error occurred while creating a donor data.');
  }
});

// CREATE A NEW DONOR

app.post('/api/donor/create', async (req, res) => {
  const newDonor = req.body;
  try {
    const queryText = 'INSERT INTO donors (id, first_name, last_name) VALUES ($1, $2, $3)';
    await pool.query(queryText, [newDonor.id, newDonor.firstName, newDonor.lastName]);
    res.status(201).send('Donor Created Successfully.');
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).send('Internal server error occurred while creating a donor data.');
  }
});

// CREATE A NEW DONATION

app.post('/api/donations/create', async (req, res) => {
  const newDonation = req.body;
  try {
    const queryText = 'INSERT INTO donations (donor_id, campaign_id, amount, date) VALUES ($1, $2, $3, $4)';
    await pool.query(queryText, [newDonation.donorId, newDonation.campaignId, newDonation.amount, newDonation.date]);
    res.status(201).send('Added Donation Successfully.');
  } catch (error) {
    console.error('Error adding donation:', error);
    res.status(500).send('Internal server error occurred while adding donation data.');
  }
});

// GET ALL DONATIONS

app.get('/api/donations/all', async (req, res) => {
    try {
      const queryText = 'SELECT donations.id,donors.first_name, donors.last_name, donations.amount from donors JOIN donations on donors.id=donations.donor_id;';
      const donors = await pool.query(queryText);
      res.status(201).send(donors.rows);
    } catch (error) {
      console.error('Error getting donations:', error);
      res.status(500).send('Internal server error occurred while getting donations data.');
    }
  });

// CREATE A NEW CAMPAIGN

app.post('/api/campaigns/create', async (req, res) => {
    const newCampaign = req.body;
    try {
      const queryText = 'INSERT INTO campaigns (id,name) VALUES ($1, $2)';
      await pool.query(queryText, [newCampaign.id, newCampaign.name]);
      res.status(201).send('Registered Campaign Successfully.');
    } catch (error) {
      console.error('Error adding campaign:', error);
      res.status(500).send('Internal server error occurred while adding campaign data.');
    }
  });
  
// GET ALL CAMPAIGNS

app.get('/api/campaigns/all', async (req, res) => {
    try {
    const queryText = 'SELECT * FROM campaigns;';
    const campaigns = await pool.query(queryText);
    res.status(200).send(campaigns.rows);
    } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).send('Internal server error occurred while getting campaigns data.');
    }
});

// EDIT CAMPAIGNS
app.put('/api/campaigns/update', async (req, res) => {
    const updatedCampaign = req.body;
    try {
    const queryText = 'UPDATE campaigns SET name = ($1) WHERE id = ($2)';
    const campaigns = await pool.query(queryText,[updatedCampaign.name, updatedCampaign.id]);
    res.status(200).send(campaigns.rows);
    } catch (error) {
    console.error('Error updating campaigns:', error);
    res.status(500).send('Internal server error occurred while updating campaigns data.');
    }
});
// DELETE CAMPAIGNS
app.delete('/api/campaigns/delete/:id', async (req, res) => {
    const toDeleteId = req.params.id;
    try {
    const queryText = 'DELETE FROM campaigns WHERE id = $1';
    const campaigns = await pool.query(queryText,[toDeleteId]);
    res.status(200).send({message: "Campaigns deleted successfully!"});
    } catch (error) {
    console.error('Error deleting campaigns:', error);
    res.status(500).send('Internal server error occurred while deleting campaigns data.');
    }
});

// GET ALL REPORT
app.get('/api/report', async (req, res) => {
    try {
      const queryText = 'SELECT (SELECT SUM(amount) FROM donations) AS total_donations,(SELECT COUNT(DISTINCT id) FROM donors) AS total_donors;';
      const donors = await pool.query(queryText);
      res.status(201).send(donors.rows[0]);
    } catch (error) {
      console.error('Error getting report:', error);
      res.status(500).send('Internal server error occurred while getting report data.');
    }
  });
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
