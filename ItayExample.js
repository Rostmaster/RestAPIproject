const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Example POST route where an error might be thrown
app.post('/data', (req, res, next) => {
    if (!req.body.data) {
        // Throwing an error here
        throw new CustomError("Missing data", 400);
        // This is equivalent to calling next with an error:
        // next(new CustomError("Missing data", 400));
    }
    // Suppose this condition passes
    res.status(200).send("Data processed successfully");
});

// Error-handling middleware
app.use((err, req, res, next) => {
    // This middleware catches any errors thrown in the app
    const status = err.statusCode || 500;
    res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
