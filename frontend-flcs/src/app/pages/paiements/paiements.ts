import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class Paiements implements OnInit {

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

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  chargerPaiements() {
    if (!this.eleveId) return;

    // reset propre
    this.loading = true;
    this.error = '';
    this.resume = null;
    this.paiements = [];
    this.cdr.detectChanges();

    /* ======================
       Résumé financier
    ====================== */
    this.api.getResumePaiementsEleve(this.eleveId).subscribe({
      next: data => {
        this.resume = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur chargement résumé';
        this.cdr.detectChanges();
      }
    });

    /* ======================
       Historique paiements
    ====================== */
    this.api.getHistoriquePaiementsEleve(this.eleveId).subscribe({
      next: data => {
        this.paiements = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur chargement paiements';
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  enregistrerPaiement() {
    if (!this.eleveId) return;

    this.loading = true;
    this.cdr.detectChanges();

    this.nouveauPaiement.eleveId = this.eleveId;

    this.api.createPaiement(this.nouveauPaiement).subscribe({
      next: () => {
        alert('Paiement enregistré');

        // reset formulaire
        this.nouveauPaiement = {
          montant: 0,
          datePaiement: '',
          referenceVirement: '',
          eleveId: this.eleveId
        };

        this.cdr.detectChanges();

        // recharger les données
        this.chargerPaiements();
      },
      error: () => {
        alert('Erreur lors de l’enregistrement');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  exporterPdf() {
    if (!this.eleveId) return;

    this.loading = true;
    this.cdr.detectChanges();

    this.api.exportPaiementsPdf(this.eleveId).subscribe({
      next: blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paiements-eleve-${this.eleveId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        alert('Erreur export PDF');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
