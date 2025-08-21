// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJnCZDNEXmvreWIjeJGJUHF-IuP_p9tZ0",
  authDomain: "cafezin-a0ffa.firebaseapp.com",
  projectId: "cafezin-a0ffa",
  storageBucket: "cafezin-a0ffa.firebasestorage.app",
  messagingSenderId: "310058601096",
  appId: "1:310058601096:web:22d1aa56b8196571516d3d",
  measurementId: "G-4W7G4493Z2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Make available globally
window.firebaseAuth = {
  auth: auth,
  db: db,
  
  async loginWithEmail(email, password) {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  },
  
  async registerWithEmail(email, password, userData) {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      await result.user.updateProfile({ displayName: userData.name });
      
      // Save additional user data to Firestore
      await db.collection('users').doc(result.user.uid).set({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  },
  
  async loginWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  },
  
  async logout() {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  getCurrentUser() {
    return auth.currentUser;
  },
  
  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  },
  
  getErrorMessage(errorCode) {
    const messages = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'E-mail já está em uso',
      'auth/weak-password': 'Senha muito fraca',
      'auth/invalid-email': 'E-mail inválido',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/popup-closed-by-user': 'Login cancelado pelo usuário'
    };
    return messages[errorCode] || 'Erro desconhecido';
  }
};

// Listen for auth state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Usuário logado:', user.displayName || user.email);
    // Update UI
    if (window.authSystem) {
      window.authSystem.currentUser = {
        id: user.uid,
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        picture: user.photoURL
      };
      window.authSystem.updateLoginDisplay();
    }
  } else {
    console.log('Usuário deslogado');
    if (window.authSystem) {
      window.authSystem.currentUser = null;
      window.authSystem.updateLoginDisplay();
    }
  }
});