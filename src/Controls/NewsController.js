import { useEffect, useState } from "react";
import firebase, { db, storage } from "../Models/firebase/config";
import { getDocs, collection, updateDoc } from "firebase/firestore";

const GetDepartment = () => {
  const colRef = collection(db, "Department");
  const [functions, setFunctions] = useState([]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(colRef);
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setFunctions(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return functions;
};

const uploadToFirestore = async (
  title,
  content,
  scope,
  file,
  owner,
  emailOwner,
  customGroup
) => {
  console.log(title);
  console.log(content);
  console.log(scope);
  console.log(file);
  try {
    // // Kiểm tra xem người dùng đã chọn một tệp tin hay chưa
    // Tạo một tham chiếu đến vị trí lưu trữ trong Firebase Storage
    let downloadURL = null;
    if (file) {
      const storageRef = storage.ref().child(file.name);

      // Tải tệp lên Firebase Storage
      await storageRef.put(file);

      // Lấy URL của tệp tin đã tải lên
      downloadURL = await storageRef.getDownloadURL();
    }

    // Tạo một bản ghi mới trong Firestore
    const postsCollectionRef = db.collection("posts");
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const postDocRef = await postsCollectionRef.add({
      title,
      content,
      scope,
      file: downloadURL,
      owner,
      emailOwner,
      customGroup,
      timestamp: timestamp,
    });

    console.log("Upload to Firestore successful!");
    console.log("Document written with ID: ", postDocRef.id);
    return postDocRef.id;

    // Cập nhật URL của tệp tin trong bản ghi Firestore
    // await updateDoc(postDocRef, { file: downloadURL });
  } catch (error) {
    // Xử lý lỗi tải lên Firestore
    console.error("Error uploading to Firestore: ", error);
  }
};

export { GetDepartment, uploadToFirestore };
