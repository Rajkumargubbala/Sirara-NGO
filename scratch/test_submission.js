const axios = require('axios');

async function testSubmission() {
  try {
    const response = await axios.post('http://localhost:5050/api/submissions/contact', {
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "This is a test message with more than ten characters."
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testSubmission();
