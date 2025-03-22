const express = require('express');
const neo4j = require('neo4j-driver');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const SECRET_KEY = '1234'; // Change this to a secure secret
const { CohereClientV2 } = require('cohere-ai');
const cohere = new CohereClientV2({
  token: '9StJFlYibvYlkScu4P2PXOYTl5xEr4Ye6L70mwc3', // Replace with your actual Cohere API Key
});

const app = express();
app.use(express.json());
app.use(cors());

const driver = neo4j.driver(
  'neo4j://184.168.29.119:7687', // Change if using a different port
  neo4j.auth.basic('neo4j','ooglobeneo4j') // Use your Neo4j credentials
);
const session = driver.session();

// User Registration Route
app.post('/register', async (req, res) => {
  const { email, password, age, gender } = req.body;

  if (!email || !password || !age || !gender) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user in Neo4j
    await session.run(
      `CREATE (u:Person {userID: randomUUID(), email: $email, password: $password, age: $age, gender: $gender})`,
      { email, password: hashedPassword, age, gender }
    );

    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// User Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user in Neo4j
    const result = await session.run(
      `MATCH (u:Person {email: $email}) RETURN u.userID AS userID, u.password AS hashedPassword`,
      { email }
    );

    if (result.records.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const user = result.records[0];
    const userID = user.get('userID');
    const hashedPassword = user.get('hashedPassword');

    // Compare passwords
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userID }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, userID });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Function to determine the meaning of a score based on the forum
const getScoreMeaning = (forum, score) => {
  let meaning = '';

  switch (forum) {
    case 'Socialization':
      meaning = score < 30 ? 'Poor social life' 
              : score < 60 ? 'Average social life' 
              : 'Great social life';
      break;
    case 'Learning':
      meaning = score < 30 ? 'Limited learning engagement' 
              : score < 60 ? 'Moderate learning activities' 
              : 'Excellent learning habits';
      break;
    case 'Exercise':
      meaning = score < 30 ? 'Low physical activity' 
              : score < 60 ? 'Moderate exercise routine' 
              : 'Excellent fitness level';
      break;
    case 'Diet':
      meaning = score < 30 ? 'Unhealthy eating habits' 
              : score < 60 ? 'Moderate diet balance' 
              : 'Healthy and well-balanced diet';
      break;
    case 'Stress':
      meaning = score < 30 ? 'Low stress levels' 
              : score < 60 ? 'Moderate stress levels' 
              : 'High stress, consider relaxation techniques';
      break;
    case 'Sleep':
      meaning = score < 30 ? 'Poor sleep quality' 
              : score < 60 ? 'Average sleep' 
              : 'Good sleep pattern';
      break;
    default:
      meaning = 'Unknown category';
  }
  return meaning;
};

// Score Submission Route
app.post('/submit-scores', async (req, res) => {
  const { userID, scores } = req.body;
  if (!userID || !scores) {
    return res.status(400).json({ error: 'UserID and scores are required' });
  }

  try {
    // Validate all scores are within range
    for (let forum in scores) {
      if (scores[forum] < 10 || scores[forum] > 90) {
        return res.status(400).json({ error: `${forum} score must be between 10 and 90` });
      }
    }

    // Store scores with meanings in Neo4j
    for (let forum in scores) {
      const meaning = getScoreMeaning(forum, scores[forum]);
      await session.run(
        `MERGE (u:Person {userID: $userID})
         MERGE (f:Forum {name: $forum})
         CREATE (u)-[:SUBMITTED]->(s:Score {value: $score, meaning: $meaning})
         CREATE (s)-[:BELONGS_TO]->(f)`,
        { userID, forum, score: scores[forum], meaning }
      );
    }

    res.json({ message: 'Scores submitted successfully' });
  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to fetch user scores
app.get('/view-scores/:userID', async (req, res) => {
  const { userID } = req.params;

  try {
    const result = await session.run(
      `MATCH (u:Person {userID: $userID})-[:SUBMITTED]->(s:Score)-[:BELONGS_TO]->(f:Forum)
       RETURN f.name AS forum, s.value AS value, s.meaning AS meaning`,
      { userID }
    );

    const scores = result.records.map(record => ({
      forum: record.get('forum'),
      value: record.get('value'),
      meaning: record.get('meaning')
    }));

    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to generate personalized advice
app.post('/get-advice', async (req, res) => {
  const { userID, criteria } = req.body;

  if (!userID || !criteria) {
    return res.status(400).json({ error: 'UserID and criteria are required' });
  }

  try {
    // Fetch user details and scores
    const userResult = await session.run(
      `MATCH (u:Person {userID: $userID})-[:SUBMITTED]->(s:Score)-[:BELONGS_TO]->(f:Forum)
       RETURN u.age AS age, u.gender AS gender, f.name AS forum, s.value AS score, s.meaning AS meaning`,
      { userID }
    );

    if (userResult.records.length === 0) {
      return res.status(404).json({ error: 'No user data found' });
    }

    // Extract logged-in user details
    const userScores = {};
    userResult.records.forEach(record => {
      const forum = record.get('forum');
      const score = record.get('score');
      userScores[forum] = score;
    });

    if (criteria === "Anyone") {
      // Generate a prompt using the logged-in user's data
      let prompt = `I am a ${userResult.records[0].get('age')}-year-old ${userResult.records[0].get('gender')}. Here are my health scores and their meanings:\n`;
      userResult.records.forEach(record => {
        const forum = record.get('forum');
        const score = record.get('score');
        const meaning = record.get('meaning');
        prompt += `- ${forum}: ${score}% (${meaning})\n`;
      });

      prompt += `\nBased on this information, provide personalized advice that can help improve my well-being.\n Please include my scores in the response, let the advice be very brief and well structured for easy understandability. 
      Separate the advice of each forum on a new line. The advice should be as short as possible. And include the Anyone Criteria in the response.`;

      // Call Cohere API
      const response = await cohere.chat({
        model: 'command-r-plus',
        messages: [{ role: 'user', content: prompt }],
      });

      // Extract AI-generated advice
      const advice = response.message.content.map(item => item.text).join(" ");

      // Store the generated advice in Neo4j
      await session.run(
        `MATCH (u:Person {userID: $userID})
         MERGE (a:Advice {text: $advice, criteria: 'Anyone', createdAt: timestamp()})
         CREATE (u)-[:RECEIVED]->(a)`,
        { userID, advice }
      );

      return res.json({ advice });

    } else if (criteria === "LikeMe") {
      // Find similar users based on score differences (±10% range in at least 3 forums)
      const similarUsersResult = await session.run(
        `MATCH (u1:Person {userID: $userID})-[:SUBMITTED]->(s1:Score)-[:BELONGS_TO]->(f:Forum),
               (u2:Person)-[:SUBMITTED]->(s2:Score)-[:BELONGS_TO]->(f)
         WHERE u1 <> u2 AND abs(s1.value - s2.value) <= 10
         WITH u2, count(DISTINCT f) AS commonForums
         WHERE commonForums >= 3
         MATCH (u2)-[:RECEIVED]->(a:Advice {criteria: 'Anyone'})
         RETURN a.text AS advice
         LIMIT 3`,
        { userID }
      );

      if (similarUsersResult.records.length > 0) {
        // Compile advice from similar users
        const adviceList = similarUsersResult.records.map(record => record.get('advice'));
        const advice = adviceList.join("\n\n");

        return res.json({ advice });
      } else {
        // No similar users found, generate new advice based on average scores
        const avgScoresResult = await session.run(
          `MATCH (s:Score)-[:BELONGS_TO]->(f:Forum)
           RETURN f.name AS forum, avg(s.value) AS avgScore`
        );

        let avgPrompt = `There are no directly similar users, but here are average health scores based on the community:\n`;
        avgScoresResult.records.forEach(record => {
          const forum = record.get('forum');
          const avgScore = record.get('avgScore').toFixed(2);
          avgPrompt += `- ${forum}: ${avgScore}%\n`;
        });

        avgPrompt += `\nBased on these community trends, generate personalized advice for me as if I had these average scores. 
        Let the response be brief, structured, and separated by forum. The advice should be practical and easy to follow. Include the criteria: 'LikeMe' in the response.Include which information you are using to generate the advice .`;

        // Call Cohere API
        const response = await cohere.chat({
          model: 'command-r-plus',
          messages: [{ role: 'user', content: avgPrompt }],
        });

        const advice = response.message.content.map(item => item.text).join(" ");

        // Store the generated advice in Neo4j
        await session.run(
          `MATCH (u:Person {userID: $userID})
           MERGE (a:Advice {text: $advice, criteria: 'LikeMe', createdAt: timestamp()})
           CREATE (u)-[:RECEIVED]->(a)`,
          { userID, advice }
        );

        return res.json({ advice });
      }
    }

  } catch (error) {
    console.error('Error generating advice:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Chat endpoint that handles both predefined and custom questions
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }
    
    // Call Cohere's chat API with the provided message (question)
    const response = await cohere.chat({
      model: 'command-r-plus',
      messages: [{ role: 'user', content: message }],
    });
    
    // Extract advice from the response
    const contentText = response.message.content.map(item => item.text).join(" ");
    res.json(contentText);
    
  } catch (error) {
    console.error('Error communicating with Cohere API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to save the user's answers and calculate the overall loneliness score
app.post('/social', async (req, res) => {
  const { userId, answers } = req.body;

  if (!userId || !answers) {
      return res.status(400).json({ error: 'UserID and answers are required' });
  }

  try {
      // Scale mapping (0-11 scale)
      const scaleMap = {
          'Never': 10,
          'Seldom': 8,
          'Sometimes': 6,
          'Often': 4,
          'VeryOften': 2,
          'Always': 0,
          '0': 11,
          '1': 8,
          '2': 4,
          '3-4': 2,
          '5-8': 1,
          '9+': 0,
          '< Monthly': 10,
          'Monthly': 8,
          'Few times/month': 6,
          'Weekly': 6,
          'Few times/week': 2,
          'Daily': 0
      };

      // Flatten and convert answers
      const scaledAnswers = answers.flat().map(answer => scaleMap[answer]);

      // Calculate the average score and scale it between 0 and 11
      const total = scaledAnswers.reduce((sum, val) => sum + val, 0);
      const score = Math.round(total / scaledAnswers.length);

      // Save answers and score to Neo4j
      const result = await session.run(
          `
          MERGE (u:Person {userID: $userId})
          MERGE (s:LonelinessScore {userID: $userId})
          SET s.answers = $answers, s.overallScore = $score
          RETURN s
          `,
          { userId, answers: JSON.stringify(answers), score }
      );

      res.status(201).json({ message: 'Answers saved successfully', score });
  } catch (error) {
      console.error('Error saving answers:', error);
      res.status(500).json({ error: 'Failed to save answers' });
  }
});

// Route to retrieve the user's social score
app.get('/social-score/:userId', async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await session.run(
      `
      MATCH (s:LonelinessScore {userID: $userId})
      RETURN s.overallScore AS score
      `,
      { userId }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: 'Social score not found' });
    }

    const score = result.records[0].get('score');
    res.json({ userId, score });
  } catch (error) {
    console.error('Error retrieving social score:', error);
    res.status(500).json({ error: 'Failed to retrieve social score' });
  }
});

// Save BMI value to Neo4j

app.post('/api/save-bmi', async (req, res) => {
  try {
    const { userID, bmi, category } = req.body;
    
    console.log("Received request:", { userID, bmi, category }); // Log received data

    if (!userID || !bmi || !category) {
      console.error("❌ Backend error: Missing required parameters", { userID, bmi, category });
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const session = driver.session();
    const query = `
      MATCH (p:Person {userID: $userID})
      SET p.bmi = $bmi, p.category = $category
      RETURN p.userID, p.bmi, p.category
    `;

    const result = await session.run(query, { userID, bmi, category });
    session.close();

    if (result.records.length === 0) {
      console.error("❌ Backend error: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ BMI saved successfully!");
    return res.status(200).json({ message: "BMI saved successfully!" });

  } catch (error) {
    console.error("❌ Backend error:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
});



// Start server
app.listen(5009, () => console.log('Server running on port 5009'));

