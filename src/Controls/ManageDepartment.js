import { useEffect, useState } from "react";
import { db } from "../Models/firebase/config";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const GetDepartmentName = async (departmentId) => {
  const docRef = db.collection("Department").doc(departmentId);

  return docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      } else {
        return null; // Hoặc giá trị mặc định khác nếu không tìm thấy tài liệu
      }
    })
    .catch((error) => {
      console.log("Lỗi khi lấy tài liệu:", error);
      return null; // Hoặc xử lý lỗi và trả về giá trị mặc định khác
    });
};

const AddDepartmentData = (documentId, newValue) => {
  const docRef = db.collection("users").doc(documentId);
  return docRef
    .update({
      department: newValue,
    })
    .then(() => {
      console.log("Document Department Edit updated successfully");
      return true;
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
      return false;
    });
};

export { GetDepartmentName, AddDepartmentData };
