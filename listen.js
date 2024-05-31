const app = require('./app');
const { PORT = 9080 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
