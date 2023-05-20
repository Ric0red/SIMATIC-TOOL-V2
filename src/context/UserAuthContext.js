import React, { createContext, useContext, useEffect, useState } from "react";
//import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  PhoneAuthProvider,
  signInWithCredential,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../config/firebase";
import {
  doc,
  query,
  setDoc,
  getDoc,
  getDocs,
  Timestamp,
  onSnapshot,
  updateDoc,
  collection,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Create Context
const userAuthContext = createContext();
// Reading Users
const userDB = doc(db, "USERS", "PROFILE");
const usersRead = query(collection(db, "USERS"));
const readv2 = query(collection(db, "USERS"));
//const docRef = doc(db, 'USERS', 'documento', 'PROFILE', 'documento');
//const userReadV2 = query(
export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({}); // verificar si la data es la misma del firestore
  const [verificationId, setVerificationId] = useState(null);
  const [ValueFromLocalStorage, setValueFromLocalStorage] = useState("");
  const [userDoc, setUserDoc] = useState([]);
  const [URL, setURL] = useState({});

  const [errorBackend, setErrorBackend] = useState("");

  // const getData = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("@storage_Key_userCount");

  //     if (value !== null) {
  //       // value previously stored
  //       console.log("Get storage count: ", value);
  //       setValueFromLocalStorage(value);
  //     }
  //   } catch (e) {
  //     // error reading value
  //   }
  // };

  const Create2 = async (username, password, email, name) => {
    //Linking email to account
    console.log("@Create from backend, Firestore user: ", user.uid);
    const credential = EmailAuthProvider.credential(email, password);
    await linkWithCredential(auth.currentUser, credential)
      .then((usercred) => {
        const user = usercred.user;
        console.log("Account linking success", user);
      })
      .catch((error) => {
        console.log("Account linking error", error);
      });
    //USER DB
    const userDB = doc(db, "USERS", user.uid);
    //SUBCOLECTTIONS
    const profileDocRef = doc(collection(userDB, "PROFILE"));
    const notifyDocRef = doc(collection(userDB, "NOTIFICATIONS"));
    const historyDocRef = doc(collection(userDB, "HISTORY"));

    const profile = {
      id: user.uid,
      displayName: username,
      email: email,
      phoneNumber: user.phoneNumber,
    };
    const history = [
      { id: 1, test: "Hola mundo" },
      { id: 2, test: "Hola mundo" },
      { id: 3, test: "Hola mundo" },
    ];
    const notifications = { timestamp: serverTimestamp(), name: name };

    try {
      // Set the data subcollection
      await setDoc(profileDocRef, profile);
      await setDoc(notifyDocRef, notifications);
      await setDoc(historyDocRef, history);
      console.log("@Create_NEW, success");
    } catch (error) {
      console.log("@Create from backend, error: ", error.message);
    }
  };
  const Read = async () => {
    const dbRef = doc(db, "USERS", user.uid);
    let wallet;
    try {
      // READ ACTUAL DATA
      await getDoc(dbRef).then((docSnap) => {
        if (docSnap.exists) {
          wallet = docSnap.data().arrayWallet;
          // console.log("DOC READ: ", wallet);
        } else {
          wallet = [];
        }
      });
    } catch (error) {
      console.log("@Read from backend, ERROR DOC: ", error);
    }
    return wallet;
  };
  const readOnChange = () => {
    const dbRef = doc(db, "USERS", user.uid); // USER DB
    let item = [];

    onSnapshot(dbRef, (doc) => {
      let wallet;
      // console.log('LOG ', doc.data().date);
      item.push(doc.data().arrayWallet);

      item.forEach((itemDoc) => {
        wallet = itemDoc;

        //console.log("foreach ", itemDoc);
      });
      //setUserDoc(wallet);
    });

    console.log("DATA  ", userDoc);
  };
  const Update = (value, merge) => {
    const userDB = doc(db, "USERS", user.uid);
    // Consultando BD USERS
    setDoc(userDB, value, { merge: merge })
      .then(() => {
        //SUCCESS
        console.log("Document Updated successful");
      })
      .catch((error) => {
        //failure
        alert.apply(error.message);
      });
  };
  const Delete = () => {};
  const uploadImage = (voucher) => {
    const storage = getStorage();
    const storageRef = ref(storage, "images/" + user + "/" + voucher);

    // While the file names are the same, the references point to different files
    //storageRef.name === storageRef.name;           // true
    //storageRef.fullPath === storageRef.fullPath;   // false

    // GET BLOB
    let blobImage = async () => {
      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.onerror = () => {
          reject(new TypeError("Network request failed."));
        };
        xhr.responseType = "blob";
        xhr.open("GET", voucher, true);
        xhr.send(null);
      });

      // Create file metadata including the content type
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload the file and metadata
      const uploadTask = uploadBytes(storageRef, file, metadata);
    };
  };
  const newUserRequest = (docData) => {
    try {
      // READING ACTUAL WALLET
      Read().then((wallet) => {
        // MERGE NEW DATA
        const addData = {
          beneficiary: {
            username: docData.username,
            phone: docData.phone,
            status: docData.status,
            id: docData.id,
            BankPicker: docData.BankPicker,
            invoiceURL: docData.invoiceURL,
            exchangeCoin: docData.exchangeCoin,
            exchange: docData.exchange,
            bs: docData.bs,
            date: new Date(),
          },
          arrayWallet: [...wallet, docData],
        };
        //console.log("ADD DATA: ", addData); // WORKS
        updateDoc(doc(db, "USERS", user.uid), addData);
        //console.log([...wallet, addData.beneficiary]); // WORKS
      });

      //console.log("RETURN FROM READ: ", Read);
    } catch (error) {
      console.log("@newUserRequest --- ", error.message);
    }
  };
  const syncImageURL = async () => {
    const userImageDB = doc(db, "data", "one");
    await getDoc(userImageDB)
      .then((snapshot) => {
        let data;
        // RESPONSE
        if (snapshot.exists) {
          data = snapshot.data();
          setURL(data);
        }
        console.log("Sync IMAGE URL: ", URL.invoiceURL);
      })
      .catch((error) => {
        console.log("@syncImageURL --- ", error);
      });
  };

  // useEffect(() => {
  //   const unsubscribe = onSnapshot(usersRead, (querySnapshot) => {
  //     const UserList = [];
  //     querySnapshot.forEach((doc) => {
  //       console.log(doc.data())
  //       UserList.push(doc.data());
  //     });
  //     setUser(UserList);
  //     //console.log('LISTA: ', UserList)
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(readv2, (querySnapshot) => {
      const UserList = [];
      querySnapshot.forEach((doc) => {
       // console.log(doc.data());
        UserList.push(doc.data());
      });
      setUser(UserList);
      //console.log('LISTA: ', UserList)
      //getData() // get local storage
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        //logIn,
        //signUp,
        //logOut,
        //withPhone,
        //credentialCode,
        newUserRequest,
        Create2,
        Read,
        readOnChange,
        //userDoc,
        errorBackend,
        ValueFromLocalStorage,
        //isRegisterDone,
        //verificationId,
        //setVerificationId,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
