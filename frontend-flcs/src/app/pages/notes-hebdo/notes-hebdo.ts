import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes-hebdo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-hebdo.html',
})
export class NotesHebdo {

  candidats = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      niveau: 'A1',
      notes: { s1: null, s2: null, s3: null, s4: null, s5: null }
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie',
      niveau: 'A1',
      notes: { s1: null, s2: null, s3: null, s4: null, s5: null }
    }
  ];

  enregistrer(candidat: any) {
    console.log('Enregistrement:', candidat);
  }
}
