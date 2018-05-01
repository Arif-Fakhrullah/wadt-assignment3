import { Group } from './model/group.model';
import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import {QueryFn} from 'angularfire2/firestore/interfaces';
import {Observable} from 'rxjs/Observable';
import DocumentReference = firebase.firestore.DocumentReference;


@Injectable()
export class AttendanceService {
  //readonly path = "groups";

  constructor(private afs: AngularFirestore) {}

  add(path: string, data: Group): Promise<DocumentReference> {
    return this.afs
      .collection<Group>(path)
      .add({ ...data, created: new Date() });
  }

  remove(path: string, id: string): Promise<void> {
    return this.afs.doc<Group>(`${path}/${id}`).delete();
  }

  update(path: string, id: string, data: Partial<Group>): Promise<void> {
    return this.afs.doc<Group>(`${path}/${id}`).update(data);
  }

  getCollection$(path: string, ref?: QueryFn): Observable<Group[]> {
    return this.afs
      .collection<Group>(path, ref)
      .snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Group;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
  }
}
