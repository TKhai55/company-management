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

const uploadToFirestore = async (title, content, scope, file, owner) => {
  console.log(title);
  console.log(content);
  console.log(scope);
  console.log(file);
  try {
    // Tạo một bản ghi mới trong Firestore
    const postsCollectionRef = db.collection("posts");
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const postDocRef = await postsCollectionRef.add({
      title,
      content,
      scope,
      file: null,
      owner,
      timestamp: timestamp,
    });
    // // Kiểm tra xem người dùng đã chọn một tệp tin hay chưa
    if (file) {
      // Tạo một tham chiếu đến vị trí lưu trữ trong Firebase Storage
      const storageRef = storage.ref().child(file.name);

      // Tải tệp lên Firebase Storage
      await storageRef.put(file);

      // Lấy URL của tệp tin đã tải lên
      const downloadURL = await storageRef.getDownloadURL();

      // Cập nhật URL của tệp tin trong bản ghi Firestore
      await updateDoc(postDocRef, { file: downloadURL });
    }

    // Thành công! Thực hiện các xử lý tiếp theo nếu cần.

    console.log("Upload to Firestore successful!");
    console.log("Document written with ID: ", postDocRef.id);
    return postDocRef.id;
  } catch (error) {
    // Xử lý lỗi tải lên Firestore
    console.error("Error uploading to Firestore: ", error);
  }
};

export { GetDepartment, uploadToFirestore };
