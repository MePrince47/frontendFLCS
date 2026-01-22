import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-paiements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paiements.html',
  styleUrl: './paiements.scss',
})
export class Paiements  implements OnInit {

  eleveId!: number;

  resume: any = null;
  paiements: any[] = [];

  nouveauPaiement = {
    montant: 0,
    datePaiement: '',
    referenceVirement: '',
    eleveId: 0
  };

  loading = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit() {}

  chargerPaiements() {
    if (!this.eleveId) return;

    this.loading = true;
    this.error = '';

    this.api.getResumePaiementsEleve(this.eleveId).subscribe({
      next: data => this.resume = data,
      error: () => this.error = 'Erreur chargement résumé'
    });

    this.api.getHistoriquePaiementsEleve(this.eleveId).subscribe({
      next: data => this.paiements = data,
      error: () => this.error = 'Erreur chargement paiements',
      complete: () => this.loading = false
    });
  }

  enregistrerPaiement() {
    this.nouveauPaiement.eleveId = this.eleveId;

    this.api.createPaiement(this.nouveauPaiement).subscribe({
      next: () => {
        alert('Paiement enregistré');
        this.chargerPaiements();
        this.nouveauPaiement = {
          montant: 0,
          datePaiement: '',
          referenceVirement: '',
          eleveId: this.eleveId
        };
      },
      error: () => alert('Erreur lors de l’enregistrement')
    });
  }

  exporterPdf() {
    this.api.exportPaiementsPdf(this.eleveId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paiements-eleve-${this.eleveId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
