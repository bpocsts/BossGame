import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ReferralList = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!auth.currentUser) return;
      
      const q = query(collection(db, "referrals"), where("referrerId", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      setReferrals(querySnapshot.docs.map(doc => doc.data()));
    };

    fetchReferrals();
  }, []);

  return (
    <div>
      <h2>เพื่อนที่คุณเชิญมา</h2>
      <ul>
        {referrals.map((ref, index) => (
          <li key={index}>UID: {ref.newUserId}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReferralList;
