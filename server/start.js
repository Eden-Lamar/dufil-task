const app = require('./server');
const port = process.env.PORT || 5000;

app.listen(port, () => {
	console.log(`\nServer up on port ${port}...\n`);
});

module.exports = app; // Export for Vercel