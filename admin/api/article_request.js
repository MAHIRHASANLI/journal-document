
import { firestore } from './base_firebase.js'


const Collection_Numbers = firestore.collection('articles');



//GET-ALL-DATA
export const getAllArticles = async () => {
    let AEEKinNumberArray = [];
    const querySnapshot = await Collection_Numbers.get();
    querySnapshot.forEach((doc) => {
        const data = {
            title: doc.data().title,
            description: doc.data().description,
            id: doc.id
        }
        AEEKinNumberArray.push(data)
    });
    return AEEKinNumberArray
};


//DELETE
export const deleteArticles = async (id) => {
    const documentRef = Collection_Numbers.doc(id);
    await documentRef.delete();
};


//POST
export const postArticle= async ({ title, description }) => {
    const docRef = await Collection_Numbers.add({ title, description });
    return docRef;
};



//UPDATE
export const updateArticle= async ({ title, description }, id) => {
    const documentRef = Collection_Numbers.doc(id);
    await documentRef.update({ title, description });
};


