const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

// Route for password page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for 2FA verification page
app.get('/2fa-verification', (req, res) => {
    res.sendFile(path.join(__dirname, '2fa-verification.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 Password page: http://localhost:${PORT}/`);
    console.log(`📍 2FA page: http://localhost:${PORT}/2fa-verification`);
});
