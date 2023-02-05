import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { createContext, useContext, useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { getFirebase } from "../utils/firebaseConfig";

const providers = new GoogleAuthProvider();

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  function handleGoogleLogin() {
    const { auth } = getFirebase();
    signInWithPopup(auth, providers)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        auth.currentUser.getIdTokenResult()
          .then((idTokenResult) => {
            // Confirm the user is an Admin.
            console.log(idTokenResult.claims.roles);
            if (idTokenResult.claims.roles == undefined) {
              console.log("Please Sign In again!!");
              console.log("unauthorized");
              navigate("/login");
              return 0

            } else
              if ([
                "stall_admin1",
                "stall_admin2",
                "stall_admin3",
                "stall_admin4",
                "stall_admin5",
                "stall_admin6",
                "stall_admin7",
                "stall_admin8",
                "stall_admin9",
                "stall_admin10",
                "stall_admin11",
                "stall_admin12",
                // "super_admin",
                // "cashier"
              ].includes(idTokenResult.claims.roles[0])) {
                // Show admin UI.
                user.role = idTokenResult.claims.roles[0]
                setUser(user);

              } else {

                console.log("Please Sign In again!!");
                console.log("unauthorized");
                navigate("/login");

              }
          })


      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  function handleSignOut() {
    const { auth } = getFirebase();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("You have successful sign out!!");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  }

  useEffect(() => {
    const { auth } = getFirebase();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        console.log("Please Sign In again!!");
        navigate("/login");
      }

      // if (location.pathname.toLowerCase() === "/login") {
      //   navigate("/");
      // }
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, handleGoogleLogin, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
