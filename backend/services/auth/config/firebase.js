import { cert, initializeApp } from "firebase-admin";

import serviceAccount from "./serviceAccountKey.json";

const app = initializeApp({
    credential: cert(serviceAccount)
});

export default app;
