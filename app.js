const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
    if(!error) {
        console.log(`Server is running on port ${PORT}`);
    } else {
        console.log('Error occured, server cannot start',error);
    }
})