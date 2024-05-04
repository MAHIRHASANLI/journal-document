
import { firestore } from './base_firebase.js'


const Collection_Statistics = firestore.collection('statistics');


//GET-ALL-DATA
export const getViewsWebSite = async () => {
    let viewWebSite
    const querySnapshot = await Collection_Statistics.get();
    querySnapshot.forEach((doc) => {
        viewWebSite = {
            view: doc.data().view,
            id: doc.id
        }
    })
    return viewWebSite
};


//POST
export const updateViewsWebSite = async () => {
    let view;
    const documentRef = Collection_Statistics.doc("OMRUhBNoeWfRA99jZDMj");
    await documentRef.get()
        .then(async (doc) => {
            if (doc.exists) {
                view = doc.data().view + 1
                await documentRef.update({ view });
            } else {
                console.error("Statistika yenilenmedi.");
            }
        })
};