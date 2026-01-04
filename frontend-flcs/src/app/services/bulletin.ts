import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BulletinService {

  calculerBulletin(candidat: any) {

    const notes = candidat.notesHebdo;
    const moyHebdo =
      (notes.s1 + notes.s2 + notes.s3 + notes.s4 + notes.s5) / 5;

    const moyFinale =
      (moyHebdo * 0.4) + (candidat.noteExamen * 0.6);

    return {
      ...candidat,
      moyenneHebdo: Number(moyHebdo.toFixed(2)),
      moyenneFinale: Number(moyFinale.toFixed(2)),
      decision: moyFinale >= 10 ? 'Admis' : 'Ajourné'
    };
  }
}
