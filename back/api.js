const express = require('express');
const { CohereClientV2 } = require('cohere-ai');
const cors = require('cors');

const app = express();
const PORT = 5009;

app.use(express.json());
app.use(cors());

const cohere = new CohereClientV2({
  token: '9StJFlYibvYlkScu4P2PXOYTl5xEr4Ye6L70mwc3',
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const { CohereClientV2 } = require('cohere-ai');

const cohere = new CohereClientV2({
  token: '9StJFlYibvYlkScu4P2PXOYTl5xEr4Ye6L70mwc3',
});

(async () => {
  const response = await cohere.chat({
    model: 'command-r-plus',
    messages: [
      {
        role: 'user',
        content: message,
      },
    ],
  });

  const contentText = response.message.content.map(item => item.text).join(" ");
 const advice = JSON.stringify(response, null, 2)
 //res.json({ message: "advice" });
 res.json(contentText);
 console.log(contentText)
})();

    
  } catch (error) {
    console.error('Error communicating with Cohere API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
