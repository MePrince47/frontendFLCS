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
  editionActive = false;

  candidats = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      niveau: 'A1',
      notes: { s1: null, s2: null, s3: null, s4: null, s5: null }
    }
  ];

  activerEdition() {
    this.editionActive = true;
  }

  enregistrer() {
    this.editionActive = false;
  }
}
