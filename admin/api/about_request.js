
import { firestore } from './base_firebase.js'


const Collection_Partners = firestore.collection('about');



//GET-ALL-DATA
export const getAllPartners = async () => {
    let partnerArray = [];
    const querySnapshot = await Collection_Partners.get();
    querySnapshot.forEach((doc) => {
        const data = {
            title: doc.data().title,
            description: doc.data().description,
            img: doc.data().img,
            id: doc.id
        }
        partnerArray.push(data)
    });
    return partnerArray
};


//DELETE
export const deletePartner = async (id) => {
    const documentRef = Collection_Partners.doc(id);
    await documentRef.delete();
};


//POST
export const PostPartner = async ({ title, description, img }) => {
    const docRef = await Collection_Partners.add({ title, description, img });
    return docRef;
};



//UPDATE
export const UpdatePartner = async ({ title, description, img }, id) => {
    const documentRef = Collection_Partners.doc(id);
    await documentRef.update({ title, description, img });
};


