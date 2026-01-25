import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-historique-resultats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-resultats.html',
  styleUrls: ['./historique-resultats.scss'],
})
export class HistoriqueResultats implements OnInit {
  // ======================
  // VARIABLES
  // ======================
  eleves: any[] = [];
  elevesFiltres: any[] = [];
  selectedEleve: any = null;
  eleveId!: number;

  niveaux: any[] = [];
  niveauSelectionne: any = null;
  niveauId!: number;

  bulletin: any = null;
  message: string | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  // ======================
  // INIT
  // ======================
  ngOnInit(): void {
    this.chargerEleves();
    this.chargerNiveaux();
  }

  private chargerEleves(): void {
    this.api.getEleves().subscribe({
      next: (data: any) => {
        this.eleves = Array.isArray(data) ? data : data.data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Erreur chargement des élèves';
        this.cdr.detectChanges();
      },
    });
  }

  private chargerNiveaux(): void {
    this.api.getNiveaux().subscribe({
      next: (res: any) => {
        this.niveaux = res;

        // Sélection automatique du premier niveau si disponible
        if (this.niveaux.length > 0) {
          this.niveauSelectionne = this.niveaux[0];
          this.onNiveauChange();
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Erreur chargement des niveaux';
        this.cdr.detectChanges();
      },
    });
  }

  // ======================
  // AUTOCOMPLETE ELEVE
  // ======================
  filtrerEleves(event: any): void {
    const value = event.target.value.toLowerCase();
    if (!value) {
      this.elevesFiltres = [];
      return;
    }

    this.elevesFiltres = this.eleves.filter(
      (e) => `${e.nom} ${e.prenom}`.toLowerCase().includes(value)
    );
    this.cdr.detectChanges();
  }

  selectionnerEleve(eleve: any): void {
    this.selectedEleve = eleve;
    this.eleveId = eleve.id; // ✅ Définit l’ID pour l’API
    this.elevesFiltres = [];
    this.cdr.detectChanges();
  }

  // ======================
  // SELECT NIVEAU
  // ======================
  onNiveauChange(): void {
    this.niveauId = this.niveauSelectionne?.id; // ✅ Définit l’ID pour l’API
  }

  // ======================
  // BULLETIN
  // ======================
  genererBulletin(): void {
    if (!this.eleveId || !this.niveauId) {
      this.message = 'Veuillez sélectionner un élève et un niveau';
      return;
    }

    this.api.getBulletin(this.eleveId, this.niveauId).subscribe({
      next: (res: any) => {
        this.bulletin = res;
        this.message = 'Bulletin généré';
        console.log(res);
      },
      error: (err) => {
        this.message = 'Erreur génération bulletin';
        console.error(err);
      },
    });
  }

  telechargerPdf(): void {
    if (!this.eleveId || !this.niveauId) {
      this.message = 'Veuillez sélectionner un élève et un niveau';
      return;
    }

    this.api.downloadBulletinPdf(this.eleveId, this.niveauId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulletin_${this.eleveId}_${this.niveauId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.message = 'Erreur téléchargement PDF';
        console.error(err);
      },
    });
  }
}
