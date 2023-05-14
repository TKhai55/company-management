import { useEffect, useState } from 'react'
import { db } from '../Models/firebase/config'
import { getDocs, collection } from 'firebase/firestore'

const CreateRoleController = () => {

    const colRef = collection(db, "Role");
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


const AddRoleData = async (formValues) => {
  try {
    const docRef = await db.collection('Role').add(formValues);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
    return null;
  }
}

const DeleteRoleData = async ( docId) => {
  try {
    const docRef = db.collection('Role').doc(docId);
    await docRef.delete();
    console.log('Document deleted successfully!');
  } catch (error) {
    console.error('Error deleting document: ', error);
    return null
  }
};

const EditRoleData = async ( documentId, newValue) => {
  const docRef = db.collection('Role').doc(documentId);
  docRef.update({
    priority: newValue
  })
  .then(() => {
    console.log('Document updated successfully');
  })
  .catch((error) => {
    console.error('Error updating document: ', error);
  });
};

export {AddRoleData, DeleteRoleData, EditRoleData}

export default CreateRoleController
