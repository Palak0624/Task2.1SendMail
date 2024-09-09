const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'palak')));

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'palak', 'indexa.html'));
});

app.post('/', (req, res) => {
    const { firstName, lastName, email } = req.body;

    if (!firstName || !lastName || !email) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const apiKey = '4a2449a13c689c9cb42e48dbeea4d2e6-us13';
    const listId = 'bdb58e412c';
    const url = `https://us13.api.mailchimp.com/3.0/lists/${listId}/members/`;

    const data = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName
        }
    };
    
    const jsonData = JSON.stringify(data);

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
            'Content-Type': 'application/json'
        }
    };

    const request = https.request(url, options, (response) => {
        let responseData = '';

        response.on('data', (chunk) => {
            responseData += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                res.json({ message: 'Subscription successful!' });
            } else {
                res.json({ message: 'Subscription successful!' });
            }
        });
    });

    request.on('error', (error) => {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    });

    request.write(jsonData);
    request.end();
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
