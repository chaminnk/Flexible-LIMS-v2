import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: "AIzaSyA_LDlwTbgobt1xlwSkCPuuB021XwLFQ-A",
    authDomain: "flexible-lims.firebaseapp.com",
    databaseURL: "https://flexible-lims.firebaseio.com",
    projectId: "flexible-lims",
    storageBucket: "flexible-lims.appspot.com",
    messagingSenderId: "631242038508"
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  getCurrentUser = () => this.auth().currentUser;
  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
}

export default Firebase;
