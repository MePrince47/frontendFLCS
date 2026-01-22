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

  /* ======================
     ÉLÈVE
  ====================== */
  eleveId!: number;
  eleves: any[] = [];
  elevesFiltres: any[] = [];
  selectedEleve: any = null;

  /* ======================
     DONNÉES
  ====================== */
  resume: any = null;
  paiements: any[] = [];

  nouveauPaiement = {
    montant: 0,
    datePaiement: '',
    referenceVirement: '',
    eleveId: 0
  };

  /* ======================
     UI STATE
  ====================== */
  loading = false;
  error = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  /* ======================
     INIT
  ====================== */
  ngOnInit(): void {
    this.chargerEleves();
  }

  private chargerEleves(): void {
    this.api.getEleves().subscribe({
      next: (data:any) => {
        this.eleves = Array.isArray(data) ? data : data.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Erreur chargement des élèves';
        this.cdr.detectChanges();
      }
    });
  }

  /* ======================
     AUTOCOMPLETE
  ====================== */
  filtrerEleves(event: any): void {
    const value = event.target.value.toLowerCase();

    if (!value) {
      this.elevesFiltres = [];
      return;
    }

    this.elevesFiltres = this.eleves.filter(e =>
      `${e.nom} ${e.prenom}`.toLowerCase().includes(value)
    );

    this.cdr.detectChanges();
  }

  selectionnerEleve(eleve: any): void {
    this.selectedEleve = eleve;
    this.eleveId = eleve.id;
    this.nouveauPaiement.eleveId = eleve.id;
    this.elevesFiltres = [];

    // reset données
    this.resume = null;
    this.paiements = [];

    this.cdr.detectChanges();
    this.chargerPaiements();
  }

  /* ======================
     CHARGEMENT PAIEMENTS
  ====================== */
  chargerPaiements(): void {
    if (!this.eleveId) return;

    this.loading = true;
    this.error = '';
    this.resume = null;
    this.paiements = [];
    this.cdr.detectChanges();

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

  /* ======================
     ENREGISTREMENT
  ====================== */
  enregistrerPaiement(): void {
    if (!this.eleveId) {
      alert('Veuillez sélectionner un élève');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.api.createPaiement(this.nouveauPaiement).subscribe({
      next: () => {
        alert('Paiement enregistré');

        this.nouveauPaiement = {
          montant: 0,
          datePaiement: '',
          referenceVirement: '',
          eleveId: this.eleveId
        };

        this.cdr.detectChanges();
        this.chargerPaiements();
      },
      error: () => {
        alert('Erreur lors de l’enregistrement');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /* ======================
     EXPORT PDF
  ====================== */
  exporterPdf(): void {
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
      error: () => {
        alert('Erreur export PDF');
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
