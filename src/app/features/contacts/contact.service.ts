import { inject, Injectable } from "@angular/core";
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, DocumentReference, Firestore, getDoc, orderBy, query, updateDoc } from "@angular/fire/firestore";
import { APP_CONTACTS } from "@shared/constants";
import { Contact } from "./contact.interfaces";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class ContactService{
    private readonly _firestore = inject(Firestore)
    private readonly _contactCollection = collection(this._firestore, APP_CONTACTS.COLLECTION_NAME);

    newContact(contact: Partial<Contact>): Promise<DocumentReference<DocumentData, DocumentData>> {
        return addDoc(this._contactCollection, {
            created: Date.now(),
            updated: Date.now(),
            ...contact,
        })
    }

    getAllContacts() {
        const queryFn = query(this._contactCollection, orderBy('created', 'desc'));
        return collectionData(queryFn, {idField: 'id'}) as Observable<Contact[]>
    }

    async getContactById(id: string){
        const docRef = this._getDocRef(id);
        const documentData = await getDoc(docRef)
        return documentData.data() as Contact;
    }

    updateContact(id: string, contact: Contact){
        const docRef = this._getDocRef(id);
        updateDoc(docRef, {...contact})
    }

    deleteContact(id: string, contact?: Contact){
        const docRef = this._getDocRef(id);
        deleteDoc(docRef)
    }

    private _getDocRef(id: string){
        return doc(this._firestore, APP_CONTACTS.COLLECTION_NAME, id)
    }
}