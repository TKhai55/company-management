import { useEffect, useState } from 'react'
import { db } from '../Models/firebase/config'
import { getDocs, collection } from 'firebase/firestore'

const ManageRoleController = () => {

    const colRef = collection(db, "RoleFunction");
    const [functions, setFunctions] = useState([]);

    const fetchData = async () => {
        const querySnapshot = await getDocs(colRef);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setFunctions(data)
      }
    
    useEffect(() => {
        fetchData();
      }, []);
    return functions;
}

const GetFunctionData = () => {

  const colRef = collection(db, "Functions");
  const [functions, setFunctions] = useState([]);

  const fetchData = async () => {
      const querySnapshot = await getDocs(colRef);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setFunctions(data)
    }
  
  useEffect(() => {
      fetchData();
    }, []);
  return functions;
}

const AddMnRoleData = async (formValues) => {
  try {
    const docRef = await db.collection('RoleFunction').add(formValues);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    return null;
  }
}

const DeleteMnRoleData = async ( docId) => {
  try {
    const docRef = db.collection('RoleFunction').doc(docId);
    await docRef.delete();
    console.log('Document deleted successfully!');
  } catch (error) {
    console.error('Error deleting document: ', error);
    return null
  }
};

const EditMnRoleData = async ( documentId, newValue) => {
  const docRef = db.collection('RoleFunction').doc(documentId);
  docRef.update({
    stt: newValue
  })
  .then(() => {
    console.log('Document updated successfully');
  })
  .catch((error) => {
    console.error('Error updating document: ', error);
  });
};

export {GetFunctionData, AddMnRoleData, DeleteMnRoleData, EditMnRoleData}

export default ManageRoleController
