export default {
	cors: true
}
const port = process.env.PORT || 8080;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
});