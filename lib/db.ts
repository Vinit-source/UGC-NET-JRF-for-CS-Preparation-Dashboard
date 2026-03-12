import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface UGCPrepDB extends DBSchema {
  keyval: {
    key: string;
    value: any;
  };
  scores: {
    key: string;
    value: {
      id: string;
      targetId: string;
      targetType: 'unit' | 'topic' | 'subtopic';
      score: number;
      maxScore: number;
      date: number;
    };
    indexes: { 'by-targetId': string };
  };
  focus: {
    key: string;
    value: {
      targetId: string;
      level: 'low' | 'medium' | 'high';
    };
  };
  schedule: {
    key: string;
    value: {
      id: string;
      targetId: string;
      date: number;
    };
    indexes: { 'by-targetId': string, 'by-date': number };
  };
  journal: {
    key: string;
    value: {
      id: string;
      date: number;
      content: string;
      tags: string[];
    };
    indexes: { 'by-date': number };
  };
}

let dbPromise: Promise<IDBPDatabase<UGCPrepDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<UGCPrepDB>('ugc-net-prep', 1, {
      upgrade(db) {
        db.createObjectStore('keyval');
        const scoreStore = db.createObjectStore('scores', { keyPath: 'id' });
        scoreStore.createIndex('by-targetId', 'targetId');
        db.createObjectStore('focus', { keyPath: 'targetId' });
        const scheduleStore = db.createObjectStore('schedule', { keyPath: 'id' });
        scheduleStore.createIndex('by-targetId', 'targetId');
        scheduleStore.createIndex('by-date', 'date');
        const journalStore = db.createObjectStore('journal', { keyPath: 'id' });
        journalStore.createIndex('by-date', 'date');
      },
    });
  }
  return dbPromise;
}
