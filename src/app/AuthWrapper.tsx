"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { auth } from "@/firebase"; // Use alias import for clarity
import { onAuthStateChanged } from "firebase/auth";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setAuthState(true));
        dispatch(
          setUserDetailsState({
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            profilePic: user.photoURL || "",
          })
        );
      } else {
        console.log("User is signed out");
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
