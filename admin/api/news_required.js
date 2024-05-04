
import { firestore } from './base_firebase.js'


const Collection_News = firestore.collection('news');



//GET-ALL-DATA
export const getAllNews = async () => {
    let partnerArray = [];
    const querySnapshot = await Collection_News.get();
    querySnapshot.forEach((doc) => {
        const data = {
            title: doc.data().title,
            text: doc.data().text,
            date: doc.data().date,
            img: doc.data().img,
            id: doc.id
        }
        partnerArray.push(data)
    });
    return partnerArray
};


//DELETE
export const deleteNews = async (id) => {
    const documentRef = Collection_News.doc(id);
    await documentRef.delete();
};


//POST
export const PostNews = async ({ title, img, date, text }) => {
    const docRef = await Collection_News.add({ title, img, date, text });
    return docRef;
};



//UPDATE
export const UpdateNews = async ({ title, img, date, text }, id) => {
    const documentRef = Collection_News.doc(id);
    await documentRef.update({ title, img, date, text });
};

