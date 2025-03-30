import { auth, db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

const InviteLink = () => {
  const [inviteLink, setInviteLink] = useState("");

  const generateInviteLink = async () => {
    if (!auth.currentUser) return;

    const refCode = auth.currentUser.uid; // ใช้ UID ของผู้ใช้เป็นรหัสเชิญ
    const link = `https://yourapp.com/invite?ref=${refCode}`;

    await addDoc(collection(db, "invites"), {
      userId: refCode,
      inviteLink: link,
      createdAt: new Date(),
    });

    setInviteLink(link);
  };

  return (
    <div>
      <button onClick={generateInviteLink}>สร้างลิงก์เชิญ</button>
      {inviteLink && <p>แชร์ลิงก์นี้ให้เพื่อน: <a href={inviteLink}>{inviteLink}</a></p>}
    </div>
  );
};

export default InviteLink;
