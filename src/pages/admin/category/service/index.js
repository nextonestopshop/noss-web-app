import { firestore } from "../../../../firebase";


export const getCategoryBasedOnParentId = async(id) => {
    return await firestore.collection('category')
        .where('parentId', '==', id)
        .orderBy('name')
        .get().then(snapshot => {
                const listItems = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                return listItems
            }).catch(err => console.log(err))
}