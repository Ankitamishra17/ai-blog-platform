const admin = require("firebase-admin");

let adminConfig;

// ✅ If running on production (Render)
if (process.env.FIREBASE_PRIVATE_KEY) {
  adminConfig = {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  };
}
// ✅ If running locally
else {
  const serviceAccount = require("../serviceAccountKey.json");

  adminConfig = {
    credential: admin.credential.cert(serviceAccount),
  };
}

admin.initializeApp(adminConfig);

module.exports = admin;
