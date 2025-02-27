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
        content: 'importance of having sex',
      },
    ],
  });

  console.log("API Response:", JSON.stringify(response, null, 2));
})();
