import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './bulletin.html'
})
export class Bulletin {

  niveaux: any[] = [];              // liste des niveaux
  niveauSelectionne: any = null;    // niveau choisi
  eleves: any[] = [];               // liste des élèves du niveau
  loading: boolean = false;         // spinner global
  message: string = '';             // message succès
  error: string = '';               // message erreur

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}
      ngOnInit() {
          this.chargerNiveaux();
        }
  // Charger les niveaux pour le menu déroulant
    chargerNiveaux() {
    this.api.getNiveaux().subscribe(res => {
      this.niveaux = res;

      // ✅ Sélection automatique du premier niveau
      if (this.niveaux.length > 0) {
        this.niveauSelectionne = this.niveaux[0];
        this.onNiveauChange();
      }
      this.cdr.detectChanges();
    });
  }

  // Quand on change de niveau dans la sélection
  onNiveauChange() {
    if (!this.niveauSelectionne) return;
    this.loading = true;
    this.message = '';
    this.error = '';
    this.chargerEleves();
  }

  // Charger les élèves du niveau sélectionné
  chargerEleves() {
    this.api.getElevesByNiveau(this.niveauSelectionne.id).subscribe({
      next: (eleves) => {
        this.eleves = eleves;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Impossible de charger les élèves';
        this.cdr.detectChanges();
      }
    });
  }

  /* =======================
     BULLETIN / PDF
  ======================== */

// Télécharger le bulletin PDF d’un niveau
telechargerBulletinNiveau() {
  if (!this.niveauSelectionne) return;

  // D'abord, générer les résultats
  this.api.genererResultatsNiveau(this.niveauSelectionne.id).subscribe({
    next: () => {
      // Une fois générés, on télécharge le PDF
      this.api.getResultatsNiveauPdf(this.niveauSelectionne.id).subscribe({
        next: (blob) => this.telechargerFichier(blob, `Bulletin-Niveau-${this.niveauSelectionne.code}.pdf`),
        error: () => this.error = 'Erreur lors du téléchargement du PDF'
      });
    },
    error: (err) => {
      if (err.error?.details === 'Résultat déjà généré') {
        // Résultat déjà généré → on peut juste télécharger le PDF
        this.api.getResultatsNiveauPdf(this.niveauSelectionne.id).subscribe({
          next: (blob) => this.telechargerFichier(blob, `Bulletin-Niveau-${this.niveauSelectionne.code}.pdf`),
          error: () => this.error = 'Erreur lors du téléchargement du PDF'
        });
      } else {
        this.error = 'Impossible de générer les résultats';
      }
    }
  });
}


  // Télécharger le bulletin PDF d’un élève
telechargerBulletinEleve(eleve: any) {
  if (!this.niveauSelectionne) return;
  this.loading = true;
  this.message = '';
  this.error = '';

  this.api.genererResultatEleve(eleve.id, this.niveauSelectionne.id).subscribe({
    next: () => {
      // Une fois généré, on télécharge le PDF
      this.api.getResultatElevePdf(eleve.id, this.niveauSelectionne.id).subscribe({
        next: (blob) => {
          this.loading = false;
          this.telechargerFichier(blob, `Bulletin-${eleve.nom}-${eleve.prenom}.pdf`);
        },
        error: () => {
          this.loading = false;
          this.error = 'Erreur lors du téléchargement du PDF';
        }
      });
    },
    error: () => {
      this.loading = false;
      this.error = `Impossible de générer le bulletin pour ${eleve.nom} ${eleve.prenom}`;
    }
  });
}


genererResultatsNiveau() {
  if (!this.niveauSelectionne) return;
  this.loading = true;
  this.message = '';
  this.error = '';

  this.api.genererResultatsNiveau(this.niveauSelectionne.id).subscribe({
    next: () => {
      this.loading = false;
      this.message = `Résultats du niveau ${this.niveauSelectionne.code} générés`;
      this.cdr.detectChanges();
    },
    error: () => {
      this.loading = false;
      this.error = 'Erreur lors de la génération des résultats';
      this.cdr.detectChanges();
    }
  });
}

  // Fonction utilitaire pour déclencher le téléchargement d’un Blob
  private telechargerFichier(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
/* =======================
   NIVEAUX – ACTIONS ADMINISTRATIVES
======================= */
promouvoirNiveau() {
  if (!this.niveauSelectionne) return;

  this.api.promouvoirNiveau(this.niveauSelectionne.id).subscribe({
    next: () => {
      this.message = `✅ Niveau ${this.niveauSelectionne.code} promu avec succès !`;
      this.error = '';
      this.niveauSelectionne.promu = true; // flag côté front pour désactiver le bouton
      this.cdr.detectChanges(); // met à jour le template immédiatement
    },
    error: (err) => {
      if (err.error?.details === 'Niveau déjà promu') {
        this.error = `⚠ Le niveau ${this.niveauSelectionne.code} a déjà été promu.`;
        this.niveauSelectionne.promu = true;
      } else if (err.error?.details === 'Niveau non clôturé') {
        this.error = `⚠ Vous devez clôturer le niveau ${this.niveauSelectionne.code} avant de le promouvoir.`;
      } else {
        this.error = `Niveau déjà promu Erreur ⚠ lors de la promotion`;
      }
      this.message = '';
      this.cdr.detectChanges(); // met à jour le template immédiatement
    }
  });
}

cloturerNiveau() {
  if (!this.niveauSelectionne) return;

  this.api.cloturerNiveau(this.niveauSelectionne.id).subscribe({
    next: () => {
      this.message = `✅ Niveau ${this.niveauSelectionne.code} clôturé avec succès !`;
      this.error = '';
      this.niveauSelectionne.cloture = true; // flag côté front pour désactiver le bouton
      this.cdr.detectChanges();
    },
    error: (err) => {
      if (err.error?.details === 'Niveau déjà clôturé') {
        this.error = `⚠ Le niveau ${this.niveauSelectionne.code} est déjà clôturé.`;
        this.niveauSelectionne.cloture = true;
      } else {
        this.error = `Erreur lors de la clôture : ${err.status} ${err.statusText}`;
      }
      this.message = '';
      this.cdr.detectChanges();
    }
  });
}

}
