import { db } from './firebase.js';
import { doc, getDoc, setDoc, collection, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { localDB as defaultDB } from './data.js';

const localDataService = {
    _userId: null,
    _unsubscribe: null, // To stop listening for real-time updates on logout

    setUserId: (userId) => {
        localDataService._userId = userId;
        // If a real-time listener is active, stop it.
        if (localDataService._unsubscribe) {
            localDataService._unsubscribe();
        }
    },

    // REAL-TIME LISTENER for the logged-in student's data
    listenToUserData: (appId, callback) => {
        if (!localDataService._userId) return;
        
        const userDocRef = doc(db, "users", localDataService._userId);

        // onSnapshot creates a live connection to the database
        localDataService._unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap); // Pass the live data to the UI
            } else {
                // If the user has logged in for the first time after signing up, their document won't exist.
                // We create it here using the default template from data.js.
                setDoc(userDocRef, defaultDB).then(() => {
                    console.log("New user profile created in Firestore.");
                });
            }
        });
    },
    
    // FETCH ALL STUDENTS for the admin dashboard
    getAllStudents: async () => {
        const usersCollectionRef = collection(db, "users");
        try {
            const querySnapshot = await getDocs(usersCollectionRef);
            const students = [];
            querySnapshot.forEach((doc) => {
                // You can add logic here to exclude admins if needed
                students.push({ id: doc.id, ...doc.data() });
            });
            return students;
        } catch (e) {
            console.error("Failed to get all students from Firestore", e);
            return [];
        }
    },

    // Authoritative scores, quiz completion, and achievements are written by
    // the authenticated server endpoint in api/quiz.js using Firebase Admin SDK.
    // Do not add client-side writes for these protected fields.
    
    // These functions are kept to prevent errors but are no longer central to the logic
    initialize: () => {},
    clearData: () => { console.warn("clearData is not recommended in Firestore mode."); },
    ensureUserProfile: async () => {}, // Handled by listenToUserData
    getUserDoc: async (appId) => {
        if (!localDataService._userId) return { data: () => ({...defaultDB}) };
        const userDocRef = doc(db, "users", localDataService._userId);
        return await getDoc(userDocRef);
    }
};

export { localDataService };
