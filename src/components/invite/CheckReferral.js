import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

const CheckReferral = () => {
  const [searchParams] = useSearchParams();
  const referrerId = searchParams.get("ref");

  useEffect(() => {
    if (referrerId && auth.currentUser) {
      addDoc(collection(db, "referrals"), {

        referrerId,
        newUserId: auth.currentUser.uid, // ผู้ใช้ที่เพิ่งสมัคร
        createdAt: new Date(),
      });
    }
  }, [referrerId]);

  return null;
};

export default CheckReferral;
