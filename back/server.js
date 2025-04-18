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
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Find user in Neo4j
    const result = await session.run(
      `MATCH (u:Person {email: $email}) RETURN u.userID AS userID`,
      { email }
    );

    if (result.records.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const userID = result.records[0].get('userID');

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

// Helper function to calculate MNA score
const calculateMnaScore = (answers) => {
  let score = 0;

  // Question 1: Food intake decline
  if (answers["food-intake"] === "severe decrease in food intake") score += 0; // Bad
  else if (answers["food-intake"] === "moderate decrease in food intake") score += 2; // Moderate
  else if (answers["food-intake"] === "no decrease in food intake") score += 3; // Good

  // Question 2: Weight loss
  if (answers["weight-loss"] === "weight loss greater than 3 kg (6.6 lbs)") score += 0; // Bad
  else if (answers["weight-loss"] === "weight loss between 1 and 3 kg (2.2 and 6.6 lbs)") score += 1; // Moderate
  else if (answers["weight-loss"] === "does not know") score += 2; // Moderate (slightly worse than no loss)
  else if (answers["weight-loss"] === "no weight loss") score += 3; // Good

  // Question 3: Mobility
  if (answers["mobility"] === "bed or chair bound") score += 0; // Bad
  else if (answers["mobility"] === "able to get out of bed / chair but does not go out") score += 2; // Moderate
  else if (answers["mobility"] === "goes out") score += 3; // Good

  // Question 4: Stress or disease in the past 3 months
  if (answers["stress"] === "yes") score += 1; // Moderate
  else if (answers["stress"] === "no") score += 3; // Good

  // Question 5: Neuropsychological problems
  if (answers["neuro"] === "severe dementia or depression") score += 0; // Bad
  else if (answers["neuro"] === "mild dementia") score += 2; // Moderate
  else if (answers["neuro"] === "no psychological problems") score += 3; // Good

  // Normalize the score into one of the ranges (0-7, 8-11, 12-14)
  if (score <= 7) {
    // Bad condition: score between 0 and 7
    score = Math.max(score, 0);
  } else if (score <= 11) {
    // Moderate condition: score between 8 and 11
    score = Math.max(score, 8);
  } else {
    // Good condition: score between 12 and 14
    score = Math.min(score, 14);
  }

  return score;
};


// Endpoint to submit MNA test answers and store the score
app.post("/api/mna-test", async (req, res) => {
  const { userID, answers } = req.body;

  if (!userID || !answers) {
    return res.status(400).send({ error: "Invalid request" });
  }

  // Calculate the MNA score
  const score = calculateMnaScore(answers);

  try {
    // Store the score in the Neo4j database
    await session.run(
      "MATCH (p:Person {userID: $userID}) SET p.mnaScore = $score RETURN p",
      { userID, score }
    );
    
    return res.status(200).send({ message: "Test submitted and score saved!" });
  } catch (error) {
    console.error("Error saving MNA score:", error);
    return res.status(500).send({ error: "Failed to save score. Please try again." });
  }
});



app.get("/api/mna-score", async (req, res) => {
  const { userID } = req.query;

  if (!userID) {
    return res.status(400).json({ error: "UserID is required" });
  }

  try {
    const result = await session.run(
      "MATCH (p:Person {userID: $userID}) RETURN p.mnaScore AS mnaScore",
      { userID }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const mnaScore = result.records[0].get("mnaScore");

    if (mnaScore === null) {
      return res.status(404).json({ error: "MNA score not available" });
    }

    return res.status(200).json({ mnaScore });
  } catch (error) {
    console.error("Database Query Failed:", error);
    return res.status(500).json({ error: "Database query failed. Check backend logs." });
  }
});

// Function to calculate stress score

function calculateStressScore(responses) {
  const scaleMap = {
    "Never": 0,
    "Almost Never": 1,
    "Sometimes": 2,
    "Fairly Often": 3,
    "Very Often": 4
  };

  const scores = Object.values(responses).map((answer) => scaleMap[answer] || 0);
  const totalScore = scores.reduce((sum, val) => sum + val, 0);

  return totalScore;
}


// API to receive stress responses and save to Neo4j
app.post("/api/stress-scale", async (req, res) => {
  const { userId, responses } = req.body;

  if (!userId || !responses) {
    return res.status(400).json({ error: "UserID and responses are required" });
  }

  try {
    const avgScore = calculateStressScore(responses);

    // Save data to Neo4j (without date)
    await session.run(
      `
      MATCH (p:Person {userID: $userId})
      MERGE (s:StressScore {userID: $userId})
      SET s.answers = $responses, s.score = $avgScore
      RETURN s
      `,
      { userId, responses: JSON.stringify(responses), avgScore }
    );

    res.status(201).json({ message: "Stress score saved successfully", avgScore });
  } catch (error) {
    console.error("Error saving stress score:", error);
    res.status(500).json({ error: "Failed to save stress score" });
  }
});


app.get("/api/stress-score/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "UserID is required" });
  }

  try {
    const result = await session.run(
      `
      MATCH (s:StressScore {userID: $userId})
      RETURN s.score AS score, s.answers AS answers
      `,
      { userId }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: "No stress score found for this user" });
    }

    const record = result.records[0];
    const score = record.get("score");
    const answers = JSON.parse(record.get("answers"));

    res.status(200).json({ score, answers });
  } catch (error) {
    console.error("Error retrieving stress score:", error);
    res.status(500).json({ error: "Failed to retrieve stress score" });
  }
});



app.post("/api/sleep-scale", async (req, res) => {
  const { userId, responses } = req.body;

  if (!userId || !responses) {
    return res.status(400).json({ error: "Missing userId or responses" });
  }

  try {
    const score = calculatePSQIScore(responses);

    const session = driver.session();

    await session.run(
      `
      MERGE (s:SleepScore {userID: $userId})
      SET s.score = $score,
          s.answers = $answers
      `,
      {
        userId,
        score,
        answers: JSON.stringify(responses),
      }
    );

    await session.close();

    res.status(200).json({ message: "Score saved successfully", score });
  } catch (error) {
    console.error("Error saving PSQI score:", error);
    res.status(500).json({ error: "Failed to save score" });
  }
});

// Function to calculate the PSQI score from form responses
function calculatePSQIScore(responses) {
  // Helper to normalize responses
  const getVal = (key) => {
    const val = responses[key];
    return isNaN(val) ? 0 : parseInt(val);
  };

  // Extract necessary data
  const sleepLatency = getVal("1-1"); // time to fall asleep (minutes)
  const sleepDuration = getVal("1-3"); // actual hours of sleep
  const bedTime = getVal("1-0"); // placeholder - if needed
  const wakeTime = getVal("1-2"); // placeholder - if needed

  // Calculate efficiency if bedtime and wake time available
  let timeInBed = 8; // placeholder fallback
  if (bedTime && wakeTime) {
    // You can calculate actual hours in bed here
    timeInBed = 8; // For simplicity
  }

  const sleepEfficiency = (sleepDuration / timeInBed) * 100;

  // Component Scores
  const component1 = mapTextToScore(responses["5-1"]); // Subjective sleep quality
  const component2 = sleepLatency <= 15 ? 0 : sleepLatency <= 30 ? 1 : sleepLatency <= 60 ? 2 : 3;
  const component3 = sleepDuration >= 7 ? 0 : sleepDuration >= 6 ? 1 : sleepDuration >= 5 ? 2 : 3;
  const component4 = sleepEfficiency >= 85 ? 0 : sleepEfficiency >= 75 ? 1 : sleepEfficiency >= 65 ? 2 : 3;

  // Component 5: Disturbances (questions 2 and 3)
  let disturbanceSum = 0;
  for (let p of [2, 3]) {
    const qList = Object.keys(responses).filter((key) => key.startsWith(`${p}-`));
    for (let q of qList) {
      disturbanceSum += mapTextToScore(responses[q]);
    }
  }
  const component5 = disturbanceSum <= 9 ? 0 : disturbanceSum <= 18 ? 1 : disturbanceSum <= 27 ? 2 : 3;

  // Component 6: Medication use
  const component6 = mapTextToScore(responses["4-0"]);

  // Component 7: Daytime dysfunction
  const q1 = mapTextToScore(responses["4-1"]);
  const q2 = mapTextToScore(responses["5-0"]);
  const component7 = q1 + q2 <= 1 ? 0 : q1 + q2 <= 2 ? 1 : q1 + q2 <= 4 ? 2 : 3;

  // Total PSQI Score
  const totalScore = component1 + component2 + component3 + component4 + component5 + component6 + component7;

  return totalScore;
}

// Converts option text to score (assumes 4 options from 0 to 3)
function mapTextToScore(answer) {
  const options = [
    "Not during the past month",
    "Less than once a week",
    "Once or twice a week",
    "Three or more times a week",
    "No problem at all",
    "Only a very slight problem",
    "Somewhat of a problem",
    "A very big problem",
    "Very good",
    "Fairly good",
    "Fairly bad",
    "Very bad",
  ];

  if (!answer) return 0;

  const index = options.findIndex((opt) =>
    answer.toLowerCase().includes(opt.toLowerCase())
  );

  return index % 4; // Maps to 0-3
}


app.get("/api/sleep-score/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "UserID is required" });
  }

  try {
    const result = await session.run(
      `
      MATCH (s:SleepScore {userID: $userId})
      RETURN s.score AS score, s.answers AS answers
      `,
      { userId }
    );

    if (result.records.length === 0) {
      return res.status(404).json({ error: "No sleep score found for this user" });
    }

    const record = result.records[0];
    const score = record.get("score");
    const answers = JSON.parse(record.get("answers"));

    res.status(200).json({ score, answers });
  } catch (error) {
    console.error("Error retrieving sleep score:", error);
    res.status(500).json({ error: "Failed to retrieve sleep score" });
  }
});


// Categorizes score into sleep quality
function interpretSleepScore(score) {
  if (score <= 5) return "Good sleep";
  if (score <= 10) return "Moderate sleep";
  if (score <= 15) return "Severe sleep";
  return "Very severe sleep";
}








// Start server
app.listen(5009, () => console.log('Server running on port 5009'));

