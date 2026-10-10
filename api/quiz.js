import { randomUUID } from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";

export const quizBank = {
    fire: [
        { q: "If you see smoke in a hallway, what's the safest action?", a: ["Run through it quickly", "Find an alternate route", "Wait for instructions", "Open a window for ventilation"], correct: 1 },
        { q: "What does 'Stop, Drop, and Roll' help with?", a: ["Finding an exit", "Signaling for help", "Extinguishing fire on your clothes", "Protecting you from smoke"], correct: 2 },
        { q: "Before opening a closed door during a fire, you must:", a: ["Yell for help", "Feel the door and doorknob for heat", "Break it down immediately", "Look for the key"], correct: 1 },
        { q: "Where is the designated meeting point after evacuating?", a: ["Anywhere far from the building", "The school parking lot", "A pre-determined location away from the building", "Back in the classroom once the alarm stops"], correct: 2 },
        { q: "What is the main reason to stay low to the ground in a fire?", a: ["To move faster", "To avoid tripping", "Cleaner, cooler air is near the floor", "To see better"], correct: 2 },
        { q: "If the fire alarm sounds, you should:", a: ["Finish your work quickly", "Call 911 immediately", "Evacuate calmly and immediately", "Wait for a teacher's instruction"], correct: 2 },
        { q: "Which of these should you NOT use during a fire evacuation?", a: ["Stairs", "Hallways", "Elevators", "Emergency exits"], correct: 2 },
        { q: "What is a common cause of fires in schools?", a: ["Overloaded electrical outlets", "Rain", "Open windows", "Loud music"], correct: 0 },
        { q: "A 'Class C' fire extinguisher is used for what type of fire?", a: ["Wood and paper", "Flammable liquids", "Electrical equipment", "Cooking oils"], correct: 2 },
        { q: "What does the 'P.A.S.S.' acronym for using a fire extinguisher stand for?", a: ["Pass, Aim, Squeeze, Sweep", "Pull, Aim, Squeeze, Sweep", "Push, Alert, Shout, Spray", "Pull, Alert, Squeeze, Spray"], correct: 1 },
        { q: "If you are trapped in a room during a fire, what should you do?", a: ["Open the window and yell", "Seal cracks around the door with cloth and call 911", "Hide under the bed", "Try to break the window"], correct: 1 },
        { q: "How often should fire drills be practiced in a school?", a: ["Once a year", "Only when there is a fire", "Regularly, according to school policy", "Never"], correct: 2 },
        { q: "If your primary exit is blocked by smoke, what should you do?", a: ["Try to run through it", "Use your secondary exit", "Break a window", "Wait for help"], correct: 1 },
        { q: "Why is it dangerous to re-enter a burning building, even if you forgot something?", a: ["You might get a detention", "The fire could reignite or the structure could collapse", "The alarm is loud", "You might get dirty"], correct: 1 },
    ],
    earthquake: [
        { q: "What is the primary action during an earthquake?", a: ["Run outside immediately", "Stand in a doorway", "Drop, Cover, and Hold On", "Go to the basement"], correct: 2 },
        { q: "After an earthquake, what is a major hazard to be aware of?", a: ["Heavy rain", "Aftershocks", "Loud noises", "Bright lights"], correct: 1 },
        { q: "If you are outdoors when an earthquake starts, where should you go?", a: ["Inside the nearest building", "To an open area away from buildings and power lines", "Under a large tree", "Into your car"], correct: 1 },
        { q: "If you are in a car during an earthquake, you should:", a: ["Drive as fast as possible to get away", "Stop in a safe place, stay in the car", "Get out and run", "Honk the horn repeatedly"], correct: 1 },
        { q: "What does 'Cover' mean in 'Drop, Cover, and Hold On'?", a: ["Cover your eyes", "Get under a sturdy piece of furniture", "Cover yourself with a blanket", "Cover your mouth"], correct: 1 },
        { q: "Why should you avoid doorways during an earthquake?", a: ["They are the first to collapse", "They can swing violently and cause injury", "They are not safer than being under a table", "All of the above"], correct: 3 },
        { q: "After the shaking stops, what is the first thing you should check for?", a: ["Your phone", "Your belongings", "Injuries to yourself and others", "The time"], correct: 2 },
        { q: "What should be in a basic earthquake emergency kit?", a: ["Video games", "Water, non-perishable food, and a first-aid kit", "School books", "Expensive jewelry"], correct: 1 },
        { q: "If you are near the coast, what additional danger should you be aware of after an earthquake?", a: ["Tornadoes", "Tsunamis", "Wildfires", "Blizzards"], correct: 1 },
        { q: "True or False: Small earthquakes mean a big one is coming.", a: ["True", "False"], correct: 1 },
        { q: "If you are in bed when an earthquake starts, what should you do?", a: ["Run to the doorway", "Get out of bed and get under it", "Stay in bed, cover your head with a pillow", "Roll onto the floor"], correct: 2 },
        { q: "True or False: It is safe to use matches or lighters right after an earthquake.", a: ["True", "False, there could be gas leaks"], correct: 1 },
    ],
    tornado: [
        { q: "What is the safest location during a tornado?", a: ["In a car", "Near a large window", "A basement or an interior room on the lowest floor", "Under a highway overpass"], correct: 2 },
        { q: "Which of these is a sign of a possible tornado?", a: ["A dark, often greenish sky and a large, rotating cloud", "A light drizzle", "A perfectly clear sky", "A gentle breeze"], correct: 0 },
        { q: "If you are in a car and cannot get to a sturdy shelter, what should you do?", a: ["Try to outrun the tornado", "Stay in the car", "Get out and lie in a ditch or low-lying area", "Climb a tree"], correct: 2 },
        { q: "What should you do to protect yourself in a tornado shelter?", a: ["Stand up and watch the tornado", "Cover your head and neck with your arms", "Open all the windows", "Talk on the phone"], correct: 1 },
        { q: "A 'Tornado Watch' means:", a: ["A tornado has been spotted", "Tornadoes are possible in your area", "The tornado is over", "It's safe to go outside"], correct: 1 },
        { q: "A 'Tornado Warning' means:", a: ["A tornado has been spotted or indicated by weather radar", "Tornadoes might happen later", "The weather is just windy", "You should watch the sky"], correct: 0 },
        { q: "What should you avoid during a tornado?", a: ["Basements", "Windows, doors, and outside walls", "Small interior rooms", "Sturdy furniture"], correct: 1 },
        { q: "After a tornado passes, what is a potential hazard?", a: ["Calm weather", "Downed power lines and broken glass", "A rainbow", "A sudden drop in temperature"], correct: 1 },
        { q: "What is the 'Tornado Alley'?", a: ["A movie", "A region in the U.S. where tornadoes are most frequent", "A type of bowling alley", "A video game"], correct: 1 },
        { q: "Why is an overpass not a safe place to shelter?", a: ["It's too high", "The wind can be funneled and accelerated under it", "It might collapse", "Both B and C"], correct: 3 },
        { q: "What is the difference between a funnel cloud and a tornado?", a: ["A funnel cloud is wider", "A funnel cloud does not touch the ground", "A funnel cloud is less dangerous", "There is no difference"], correct: 1 },
        { q: "If you live in a mobile home during a tornado warning, what should you do?", a: ["Go to the strongest part of the home", "Lie down on the floor", "Evacuate immediately to a sturdy building or shelter", "Stay inside and hope for the best"], correct: 2 },
    ],
    'active-shooter': [
        { q: "What are the three actions recommended by 'Run, Hide, Fight'?", a: ["Evacuate, Barricade, Confront", "Escape, Shelter, Defend", "Run, Hide, Fight", "Alert, Lockdown, Attack"], correct: 2 },
        { q: "When you 'Hide', what is the most important action?", a: ["Lock and/or barricade the door and remain silent", "Post on social media for help", "Call your parents", "Look out the window"], correct: 0 },
        { q: "When should you choose to 'Fight' an active shooter?", a: ["As a first option", "Only as a last resort when your life is in imminent danger", "Never", "If you have a weapon"], correct: 1 },
        { q: "If you evacuate ('Run'), what should you do?", a: ["Leave your belongings behind and keep your hands visible", "Grab your backpack first", "Run in a predictable straight line", "Stop to help others who are injured"], correct: 0 },
        { q: "When law enforcement arrives, you should:", a: ["Run towards them screaming", "Follow their instructions and keep your hands visible", "Ask them for directions", "Try to hug them"], correct: 1 },
        { q: "What is the goal of 'Hiding'?", a: ["To prepare for a fight", "To be completely out of the shooter's view", "To watch the shooter", "To make a phone call"], correct: 1 },
        { q: "Why should you silence your cell phone when hiding?", a: ["To save battery", "To avoid revealing your location", "To prevent network jams", "To listen for instructions"], correct: 1 },
        { q: "If you are in a hallway, what is your best option?", a: ["Lie down and pretend to be injured", "Try to get into a lockable room", "Run towards the shooter", "Pull the fire alarm"], correct: 1 },
        { q: "What information should you provide to a 911 operator?", a: ["Location of the shooter, number of shooters, and your location", "Your name and age", "What the shooter is wearing", "All of the above"], correct: 3 },
        { q: "True or False: You should pull the fire alarm during an active shooter event.", a: ["True", "False, it can create confusion"], correct: 1 },
        { q: "When 'Fighting' an active shooter, what can be used as an improvised weapon?", a: ["A fire extinguisher", "A chair", "A heavy book", "All of the above"], correct: 3 },
        { q: "True or False: When hiding, you should pretend to be unconscious.", a: ["True", "False, this is not a reliable strategy"], correct: 1 },
    ],
    flood: [
        { q: "What does 'Turn Around, Don't Drown' mean?", a: ["Turn your back to the water", "Never enter floodwaters", "Swim in the opposite direction", "Wait for the water to go down"], correct: 1 },
        { q: "How much moving water can knock over an adult?", a: ["6 inches", "1 foot", "2 feet", "3 feet"], correct: 0 },
        { q: "If your car stalls in floodwater, what should you do?", a: ["Stay in the car and call for help", "Abandon the car and move to higher ground", "Try to restart the engine", "Wait for the water to recede"], correct: 1 },
        { q: "What is a 'flash flood'?", a: ["A flood that happens at night", "A sudden, rapid flooding of low-lying areas", "A flood caused by a dam breaking", "A flood that is not dangerous"], correct: 1 },
        { q: "What is a major health risk from floodwater?", a: ["It is too cold", "It can be contaminated with sewage and chemicals", "It attracts sharks", "It is too salty"], correct: 1 },
        { q: "Should you use electrical appliances if you are standing in water?", a: ["Yes, if they are waterproof", "Only if you are wearing rubber boots", "No, there is a high risk of electrocution", "Yes, but be quick"], correct: 2 },
    ],
    wildfire: [
        { q: "What does 'defensible space' mean in wildfire safety?", a: ["A place to hide", "An area around a home cleared of flammable materials", "A type of fire shelter", "A firefighting term"], correct: 1 },
        { q: "If a wildfire is approaching, what is the best course of action?", a: ["Stay and defend your home", "Evacuate early following official orders", "Wait to see how close it gets", "Drive towards the fire to see it"], correct: 1 },
        { q: "What is a 'Red Flag Warning'?", a: ["A warning that a fire has started", "A warning of ideal conditions for a wildfire to start and spread", "A type of traffic signal", "A notice to stop burning leaves"], correct: 1 },
        { q: "Which of these is a good item for a wildfire evacuation kit?", a: ["A map with multiple escape routes", "Heavy winter coats", "A collection of comic books", "A single bottle of water"], correct: 0 },
    ],
    hurricane: [
        { q: "What is the center of a hurricane called?", a: ["The storm surge", "The eye wall", "The eye", "The rainband"], correct: 2 },
        { q: "What is the most dangerous element of a hurricane in coastal areas?", a: ["Wind", "Rain", "Storm surge", "Lightning"], correct: 2 },
        { q: "What does the Saffir-Simpson Scale measure?", a: ["Earthquake magnitude", "Tornado speed", "Hurricane intensity", "Flood water depth"], correct: 2 },
        { q: "Before a hurricane, what should you do with outdoor furniture?", a: ["Cover it with a tarp", "Bring it inside or secure it firmly", "Leave it as is", "Wash it thoroughly"], correct: 1 },
    ]
};


const SESSION_TTL_MS = 30 * 60 * 1000;
const QUESTIONS_PER_QUIZ = 10;
const COMPLETION_THRESHOLD = 60;

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const rawServiceAccount =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;

  if (!rawServiceAccount) {
    throw new Error("Missing Firebase Admin service-account environment variable.");
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(rawServiceAccount);
  } catch {
    throw new Error("Firebase Admin service-account environment variable must be valid JSON.");
  }

  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.FIREBASE_PROJECT_ID,
  });
}

function pickQuestionIndexes(questions) {
  const indexes = questions.map((_, index) => index);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, Math.min(QUESTIONS_PER_QUIZ, indexes.length));
}

function deriveAchievements(score, quizScore, maxQuizScore, completedQuizzes, quizType, existing) {
  const perfectScore = quizScore === maxQuizScore;
  const next = new Set(Array.isArray(existing) ? existing : []);
  if (score >= 50) next.add("Fire Safety Pro");
  if (score >= 100) next.add("Earthquake Expert");
  if (score >= 150) next.add("All-Rounder");
  if (score >= 300) next.add("Safety Superstar");
  if (completedQuizzes.length > 0) next.add("Quiz Novice");
  if (perfectScore) next.add("Perfect Score");
  if (completedQuizzes.length >= 3) next.add("Triple Threat");
  if (completedQuizzes.length >= 5) next.add("Penta-Perfect");

  const quizMasterAchievements = {
    fire: "Fire Quiz Master",
    earthquake: "Earthquake Quiz Master",
    tornado: "Tornado Quiz Master",
    flood: "Flood Quiz Master",
    wildfire: "Wildfire Quiz Master",
    hurricane: "Hurricane Quiz Master",
    "active-shooter": "Response Protocol Master",
  };
  if (perfectScore && quizMasterAchievements[quizType]) {
    next.add(quizMasterAchievements[quizType]);
  }
  if (Object.keys(quizBank).every((key) => completedQuizzes.includes(key))) {
    next.add("Safety Savant");
  }
  if (Math.floor(score / 100) + 1 >= 5) next.add("Level 5 Reached");

  return [...next];
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authorization = req.headers.authorization || "";
    const match = authorization.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: "Authentication required" });

    const app = getAdminApp();
    const decoded = await getAuth(app).verifyIdToken(match[1], true);
    const uid = decoded.uid;
    const db = getFirestore(app);
    const body = req.body && typeof req.body === "object" ? req.body : {};

    if (body.action === "start") {
      const { quizType } = body;
      if (typeof quizType !== "string" || !Object.hasOwn(quizBank, quizType)) {
        return res.status(400).json({ error: "Invalid quiz type" });
      }

      const questionIndexes = pickQuestionIndexes(quizBank[quizType]);
      if (!questionIndexes.length) {
        return res.status(400).json({ error: "No questions are available for this quiz" });
      }

      const sessionId = randomUUID();
      const now = Date.now();
      await db.collection("quizSessions").doc(sessionId).create({
        uid,
        quizType,
        questionIndexes,
        submitted: false,
        createdAt: Timestamp.fromMillis(now),
        expiresAt: Timestamp.fromMillis(now + SESSION_TTL_MS),
      });

      const questions = questionIndexes.map((questionIndex) => {
        const item = quizBank[quizType][questionIndex];
        return {
          question: item.q,
          options: item.a,
        };
      });

      return res.status(200).json({ sessionId, quizType, questions });
    }

    if (body.action === "submit") {
      const { sessionId, answers } = body;
      if (
        typeof sessionId !== "string" ||
        sessionId.length > 80 ||
        !Array.isArray(answers) ||
        answers.length < 1 ||
        answers.length > QUESTIONS_PER_QUIZ ||
        !answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 3)
      ) {
        return res.status(400).json({ error: "Invalid quiz submission" });
      }

      const sessionRef = db.collection("quizSessions").doc(sessionId);
      const userRef = db.collection("users").doc(uid);

      const result = await db.runTransaction(async (transaction) => {
        const sessionSnap = await transaction.get(sessionRef);
        if (!sessionSnap.exists) {
          const error = new Error("Quiz session not found");
          error.statusCode = 404;
          throw error;
        }

        const session = sessionSnap.data();
        if (session.uid !== uid) {
          const error = new Error("Quiz session does not belong to this user");
          error.statusCode = 403;
          throw error;
        }
        if (session.submitted) {
          const error = new Error("Quiz session has already been submitted");
          error.statusCode = 409;
          throw error;
        }
        if (!session.expiresAt || session.expiresAt.toMillis() < Date.now()) {
          const error = new Error("Quiz session expired; start a new quiz");
          error.statusCode = 410;
          throw error;
        }

        const questions = session.questionIndexes.map((index) => quizBank[session.quizType]?.[index]);
        if (
          !questions.length ||
          questions.some((question) => !question) ||
          answers.length !== questions.length ||
          answers.some((answer, index) => answer >= questions[index].a.length)
        ) {
          const error = new Error("Submission does not match the quiz session");
          error.statusCode = 400;
          throw error;
        }

        const quizScore = questions.reduce(
          (total, question, index) => total + (answers[index] === question.correct ? 20 : 0),
          0
        );
        const userSnap = await transaction.get(userRef);
        const userData = userSnap.exists
          ? userSnap.data()
          : { score: 0, achievements: [], completedQuizzes: [], lastActive: new Date().toISOString() };

        const currentScore = Number.isFinite(userData.score) ? userData.score : 0;
        const nextScore = currentScore + quizScore;
        const completedQuizzes = Array.isArray(userData.completedQuizzes)
          ? [...userData.completedQuizzes]
          : [];
        if (quizScore >= COMPLETION_THRESHOLD && !completedQuizzes.includes(session.quizType)) {
          completedQuizzes.push(session.quizType);
        }

        const achievements = deriveAchievements(
          nextScore,
          quizScore,
          questions.length * 20,
          completedQuizzes,
          session.quizType,
          userData.achievements
        );

        transaction.set(userRef, {
          score: nextScore,
          achievements,
          completedQuizzes,
          lastActive: new Date().toISOString(),
        }, { merge: true });

        transaction.update(sessionRef, {
          submitted: true,
          submittedAt: FieldValue.serverTimestamp(),
          quizScore,
        });

        return {
          score: quizScore,
          maxScore: questions.length * 20,
          totalScore: nextScore,
          achievements,
          completedQuizzes,
        };
      });

      return res.status(200).json(result);
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    if (statusCode >= 500) {
      console.error("Quiz API error:", error.message);
    }
    return res.status(statusCode).json({
      error: statusCode >= 500 ? "Quiz service unavailable" : error.message,
    });
  }
}
