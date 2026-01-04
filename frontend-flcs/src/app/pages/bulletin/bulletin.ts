import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BulletinService } from '../../services/bulletin';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bulletin.html'
})
export class Bulletin {

  bulletin: any;

  constructor(
    private route: ActivatedRoute,
    private bulletinService: BulletinService
  ) {
    const candidat = {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      niveau: 'A1',
      paye: true,
      notesHebdo: { s1: 12, s2: 14, s3: 15, s4: 13, s5: 16 },
      noteExamen: 14
    };

    this.bulletin =
      this.bulletinService.calculerBulletin(candidat);
  }
}
