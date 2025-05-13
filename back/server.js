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

    // Meaning interpretation function
    const getMeaning = (score) => {
      if (score <= 3) return 'Fine';
      if (score <= 8) return 'Normal';
      return 'Abnormal';
    };

    // Flatten and convert answers
    const scaledAnswers = answers.flat().map(answer => scaleMap[answer]);

    // Calculate the average score
    const total = scaledAnswers.reduce((sum, val) => sum + val, 0);
    const score = Math.round(total / scaledAnswers.length);

    const meaning = getMeaning(score);

    // Save to Neo4j
    const result = await session.run(
      `
      MERGE (u:Person {userID: $userId})
      MERGE (s:LonelinessScore {userID: $userId})
      SET s.answers = $answers, s.overallScore = $score, s.meaning = $meaning
      RETURN s
      `,
      {
        userId,
        answers: JSON.stringify(answers),
        score,
        meaning
      }
    );

    res.status(201).json({
      message: 'Answers and meaning saved successfully',
      score,
      meaning
    });

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


function calculateExerciseScore(responses) {
  let totalPoints = 0;
  let maxPoints = 0;

  // Scoring map based on activity quality (lower is better)
  const reverseScoring = {
    "5-7 days": 0,
    "3-4 days": 2,
    "1-2 days": 5,
    "Never": 10,
    "Fairly Often": 0,
    "Sometimes": 3,
    "Almost": 6,
    "Yes": 0,
    "No": 10,
  };

  Object.entries(responses).forEach(([key, value]) => {
    if (typeof value === "string" && reverseScoring.hasOwnProperty(value)) {
      totalPoints += reverseScoring[value];
      maxPoints += 10; // Worst case for each question
    } else if (!isNaN(parseInt(value))) {
      const num = parseInt(value);
      totalPoints += num;
      maxPoints += 10; // Assume numerical values cap at 10
    }
  });

  // Normalize: Higher activity = lower totalPoints → invert
  const score = 350 - Math.round((totalPoints / maxPoints) * 350);
  return Math.max(0, Math.min(score, 350));
}




app.post("/api/exercise-scale", async (req, res) => {
  const { userId, responses } = req.body;

  if (!userId || !responses) {
    return res.status(400).json({ error: "Missing userId or responses" });
  }

  try {
    const score = calculateExerciseScore(responses);

    const session = driver.session();

    await session.run(
      `
      MERGE (e:ExerciseScore {userID: $userId})
      SET e.score = $score,
          e.answers = $answers
      `,
      {
        userId,
        score,
        answers: JSON.stringify(responses),
      }
    );

    await session.close();

    res.status(200).json({ message: "Exercise score saved successfully", score });
  } catch (error) {
    console.error("Error saving exercise score:", error);
    res.status(500).json({ error: "Failed to save exercise score" });
  }
});





app.get("/api/exercise-score/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "UserID is required" });
  }

  try {
    const result = await session.run(
      `
      MATCH (e:ExerciseScore {userID: $userId})
      RETURN e.score AS score, e.answers AS answers
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
    console.error("Error retrieving exercise score:", error);
    res.status(500).json({  error: "Failed to retrieve exercise score" });
  }
});







function calculateLiteracyScore(answers) {
  let score = 0;

  const scoreMap = {
    "food-intake": {
      "Under 50": 1,
      "50-69": 1,
      "60-69": 1,
      "70 and above": 1,
    },
    "weight-loss": {
      "None": 0,
      "Smart TV": 0,
      "Smartphone": 1,
      "Tablet": 1,
      "Laptop/Desktop computer": 1,
    },
    "mobility": {
      "Rarely/Never": 0,
      "A few times a month": 0,
      "A few times a week": 1,
      "Daily": 1,
    },
    "stress": {
      "Sending emails": 1,
      "Browsing social media": 1,
      "Online shopping": 1,
      "Online banking": 1,
      "Watching videos": 1,
    },
    "neuro": {
      "No": 0,
      "Not sure": 0,
      "Yes": 1,
    },
    "skill": {
      "Entertainment purposes": 1,
      "Accessing information/news": 1,
      "Stay connected with family and friends": 1,
      "Improving job opportunities": 1,
      "Pursuing hobbies/interests": 1,
    },
    "class": {
      "No": 0,
      "Yes": 1,
    },
  };

  for (const key in answers) {
    const value = answers[key];
    score += scoreMap[key]?.[value] || 0;
  }

  return Math.min(score, 10); // Cap at 10
}

function getLiteracyClassification(score) {
  if (score >= 8) return "Strong Cognitive Function";
  if (score >= 6) return "Mild Cognitive Changes";
  return "Potential Cognitive Concerns";
}



app.post("/api/learn-scale", async (req, res) => {
  const { userID, answers } = req.body;

  if (!userID || !answers) {
    return res.status(400).json({ error: "Missing userID or answers" });
  }

  try {
    const score = calculateLiteracyScore(answers);
  

    const session = driver.session();

    await session.run(
      `
      MERGE (l:LiteracyScore {userID: $userID})
      SET l.score = $score,
          l.answers = $answers
      `,
      {
        userID,
        score,
       
        answers: JSON.stringify(answers),
      }
    );

    await session.close();

    res.status(200).json({ message: "Literacy score saved successfully", score });
  } catch (error) {
    console.error("Error saving literacy score:", error);
    res.status(500).json({ error: "Failed to save literacy score" });
  }
});





app.get("/api/learn-scale/:userID", async (req, res) => {
  const { userID } = req.params;

  if (!userID) {
    return res.status(400).json({ error: "Missing userID" });
  }

  try {
    const session = driver.session();

    const result = await session.run(
      `
      MATCH (l:LiteracyScore {userID: $userID})
      RETURN l.score AS score, l.answers AS answers
      `,
      { userID }
    );

    await session.close();

    if (result.records.length === 0) {
      return res.status(404).json({ error: "No score found for this user" });
    }

    const score = result.records[0].get("score");
    const answers = JSON.parse(result.records[0].get("answers"));
    

    res.status(200).json({
      score,
      answers,
    });
  } catch (error) {
    console.error("Error retrieving literacy score:", error);
    res.status(500).json({ error: "Failed to retrieve literacy score" });
  }
});



app.post('/get-advice', async (req, res) => {
  const { userID, criteria } = req.body;

  if (!userID || !criteria) {
    return res.status(400).json({ error: 'UserID and criteria are required' });
  }

  try {
    const scoreQueries = [
      { forum: 'Socialization', query: `MATCH (s:LonelinessScore {userID: $userID}) RETURN s.overallScore AS score,s.meaning AS meaning` },
      { forum: 'Diet', query: `MATCH (p:Person {userID: $userID}) RETURN p.mnaScore AS score` },
      { forum: 'Stress', query: `MATCH (s:StressScore {userID: $userID}) RETURN s.score AS score` },
      { forum: 'Sleep', query: `MATCH (s:SleepScore {userID: $userID}) RETURN s.score AS score` },
      { forum: 'Exercise', query: `MATCH (e:ExerciseScore {userID: $userID}) RETURN e.score AS score` },
      { forum: 'Learning', query: `MATCH (l:LiteracyScore {userID: $userID}) RETURN l.score AS score` }
    ];

    const userScores = {};
    for (const { forum, query } of scoreQueries) {
      const result = await session.run(query, { userID });
      if (result.records.length > 0 && result.records[0].get("score") != null) {
        userScores[forum] = result.records[0].get("score");
      }
    }

    if (Object.keys(userScores).length === 0) {
      return res.status(404).json({ error: 'No forum scores found for this user' });
    }

    const userInfo = await session.run(
      `MATCH (u:Person {userID: $userID}) RETURN u.age AS age, u.gender AS gender`,
      { userID }
    );

    if (userInfo.records.length === 0) {
      return res.status(404).json({ error: 'User info not found' });
    }

    const age = userInfo.records[0].get('age');
    const gender = userInfo.records[0].get('gender');

    // Filter prompt based only on existing scores
    let prompt = `I am a ${age}-year-old ${gender}. Here are my completed health forum scores:\n`;
    for (const forum in userScores) {
      prompt += `- ${forum}: ${userScores[forum]}%\n`;
    }

    if (criteria === 'Anyone') {
      prompt += `\nPlease give personalized, short, and structured advice per forum. Each forums advice should be on a new line. Use the 'Anyone' criteria in your guidance.Begin with score and its meaning Here is the meaning and scale of the different forum tests .

For Socialization, Not Lonely: 0-3

 Moderately Lonely: 4-8

 Severely Lonely: 9-10

 Very Severely Lonely: 11. 

 For Diet , the scale is  Normal Nutrition: 12to14

At Risk: 8-11

 Malnourished: 0-7 . 

 The stress scale is  Low Stress: 0–13

 Moderate Stress: 14-26

 High Stress: 27-40 .

  The sleep scale is  Good Sleep: 0–5

 Moderate Sleep: 6-10

 Severe Sleep: 11-15

Very Severe Sleep: 16-21 . 

The exercise scale is  Very Low Activity: 0–50

 Low to Moderate Activity: 51–150

 Moderate to Active: 151–250

Highly Active: 251–350. 

The learning scale is  Strong Cognitive Function: 8–10

 Mild Cognitive Changes: 6–7

 Potential Cognitive Concerns: 0–5 . Use the given scales to and meanings to  understand and give the users score a meaning.Remove the percentages from the display.`;

      const response = await cohere.chat({
        model: 'command-r-plus',
        messages: [{ role: 'user', content: prompt }]
      });

      const advice = response.message.content.map(item => item.text).join(" ");

      await session.run(
        `MATCH (u:Person {userID: $userID})
         MERGE (a:Advice {text: $advice, criteria: 'Anyone', createdAt: timestamp()})
         CREATE (u)-[:RECEIVED]->(a)`,
        { userID, advice }
      );

      return res.json({ advice });
    }

  
   
    // ---- LIKE ME ----
    if (criteria === 'LikeMe') {
      const othersResult = await session.run(`
        MATCH (other:Person)-[:RECEIVED]->(a:Advice {criteria: 'Anyone'})
        OPTIONAL MATCH (ls:LonelinessScore {userID: other.userID})
        OPTIONAL MATCH (ss:StressScore {userID: other.userID})
        OPTIONAL MATCH (sl:SleepScore {userID: other.userID})
        OPTIONAL MATCH (es:ExerciseScore {userID: other.userID})
        OPTIONAL MATCH (ls2:LiteracyScore {userID: other.userID})
        RETURN 
          other.userID AS otherID, 
          a.text AS advice,
          ls.overallScore AS Socialization,
          ss.score AS Stress,
          sl.score AS Sleep,
          es.score AS Exercise,
          ls2.score AS Learning,
          other.mnaScore AS Diet
      `);
    
      const otherUsers = othersResult.records.map(r => ({
        id: r.get('otherID'),
        advice: r.get('advice'),
        scores: {
          Socialization: r.get('Socialization'),
          Stress: r.get('Stress'),
          Sleep: r.get('Sleep'),
          Exercise: r.get('Exercise'),
          Learning: r.get('Learning'),
          Diet: r.get('Diet')
        }
      })).filter(u => u.advice);
    
      // Identify which forums the user attempted
      const attemptedForums = Object.entries(userScores)
        .filter(([_, value]) => value !== null && value !== undefined)
        .map(([key]) => key);
    
      const scoredMatches = [];
    
      for (const other of otherUsers) {
        const sharedForums = attemptedForums.filter(f => other.scores[f] !== null && other.scores[f] !== undefined);
        if (sharedForums.length === 0) continue;
    
        const distance = sharedForums.reduce((acc, f) => {
          return acc + Math.pow(userScores[f] - other.scores[f], 2);
        }, 0);
    
        scoredMatches.push({ distance, sharedForums, ...other });
      }
    
      const topMatches = scoredMatches.sort((a, b) => a.distance - b.distance).slice(0, 3);
    
      if (topMatches.length >= 1) {
        let prompt = `Based on the advice given to users with similar scores in the following forums:\n`;
    
        topMatches.forEach((match, i) => {
          prompt += `\nMatch #${i + 1} (Forums: ${match.sharedForums.join(', ')}):\n`;
          prompt += `${match.advice}\n`;
        });
    
        prompt += `\nGenerate personalized advice ONLY for the following forums attempted by the user: ${attemptedForums.join(', ')}. Start each forum's advice with the forum name and a short interpretation of the score. Omit unattempted forums.Here is the scale of the different forums. `;
    
        const response = await cohere.chat({
          model: 'command-r-plus',
          messages: [{ role: 'user', content: prompt }]
        });
    
        const advice = response.message.content.map(item => item.text).join(" ");
    
        await session.run(
          `MATCH (u:Person {userID: $userID})
           MERGE (a:Advice {text: $advice, criteria: 'LikeMe', createdAt: timestamp()})
           CREATE (u)-[:RECEIVED]->(a)`,
          { userID, advice }
        );
    
        return res.json({ advice });
      } else {
        // Fallback to average logic
        const avgScores = {};
        for (const { forum, query } of scoreQueries) {
          if (!attemptedForums.includes(forum)) continue;
    
          const communityQuery = query.replace(`{userID: $userID}`, '');
          const result = await session.run(communityQuery);
          const scores = result.records.map(r => r.get('score')).filter(Number);
          if (scores.length > 0) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            avgScores[forum] = avg.toFixed(2);
          }
        }
    
        let avgPrompt = `No similar users found. Based on community averages for the forums the user attempted:\n`;
        for (const forum in avgScores) {
          avgPrompt += `- ${forum}: ${avgScores[forum]}\n`;
        }
        avgPrompt += `\nGenerate advice ONLY for these forums. Mention the forum and a short interpretation of the score. Do not include unattempted forums.`;
    
        const response = await cohere.chat({
          model: 'command-r-plus',
          messages: [{ role: 'user', content: avgPrompt }]
        });
    
        const advice = response.message.content.map(item => item.text).join(" ");
    
        await session.run(
          `MATCH (u:Person {userID: $userID})
           MERGE (a:Advice {text: $advice, criteria: 'LikeMe', createdAt: timestamp()})
           CREATE (u)-[:RECEIVED]->(a)`,
          { userID, advice }
        );
    
        return res.json({ advice });
      }
    }
    

    return res.status(400).json({ error: 'Invalid criteria' });

  } catch (error) {
    console.error('Error generating advice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
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





// Start server
app.listen(5009, () => console.log('Server running on port 5009'));

