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
    { id: 1, nom: 'Jean Dupont', niveau: 'A1' },
    { id: 2, nom: 'Marie K.', niveau: 'B1' }
  ];
}