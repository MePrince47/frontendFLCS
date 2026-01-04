import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidates',
  imports: [CommonModule,RouterLink],
  templateUrl: './candidates.html',
  styleUrls: ['./candidates.scss']
})
export class Candidates {
   candidats = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      niveau: 'A1',
      paye: true
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie',
      niveau: 'B1',
      paye: false
    }
  ];
  
  editCandidat(candidat: any) {
    console.log('Modifier', candidat);
  }

}