import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-candidate-details',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './candidate-details.html',
  styleUrls: ['./candidate-details.scss']
})
export class CandidateDetails {
  candidateId!: string;

  candidate = {
    id: '1',
    nom: 'Joseph Wilfried',
    partenaire: 'Institut X',
    niveau: 'A1',
    paiement: 'PAYE'
  };

  constructor(private route: ActivatedRoute) {
    this.candidateId = this.route.snapshot.paramMap.get('id')!;
  }

  saveChanges() {
    console.log('Enregistrement...', this.candidate);
  }
}
