import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-examen-final',
  imports: [CommonModule, FormsModule],
  templateUrl: './examen-final.html',
})
export class ExamenFinal {

  editionActive = false;

  candidats = [
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      niveau: 'A1',
      noteExamen: null
    },
    {
      id: 2,
      nom: 'Martin',
      prenom: 'Sophie',
      niveau: 'B1',
      noteExamen: null
    }
  ];

  activerEdition() {
    this.editionActive = true;
  }

  enregistrer() {
    this.editionActive = false;
    console.log('Notes examen :', this.candidats);
  }
}
