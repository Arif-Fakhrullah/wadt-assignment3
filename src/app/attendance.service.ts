import { Group } from './model/group.model';
import { Module } from './model/module.model';
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

  add(path: string, data: any): Promise<DocumentReference> {
    return this.afs
      .collection<any>(path)
      .add({ ...data, created: new Date() });
  }

  remove(path: string, id: string): Promise<void> {
    return this.afs.doc<any>(`${path}/${id}`).delete();
  }

  update(path: string, id: string, data: Partial<any>): Promise<void> {
    return this.afs.doc<any>(`${path}/${id}`).update(data);
  }

  getCollection$(path: string, ref?: QueryFn): Observable<any[]> {
    return this.afs
      .collection<any>(path, ref)
      .snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      });
  }
}
