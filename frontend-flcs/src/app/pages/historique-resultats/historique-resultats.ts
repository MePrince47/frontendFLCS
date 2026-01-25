import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historique-resultats',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './historique-resultats.html',
  styleUrls: ['./historique-resultats.scss'],
})
export class HistoriqueResultats implements OnInit {
  eleves: any[] = [];
  elevesFiltres: any[] = [];
  selectedEleve: any = null;
  eleveId!: number;
  eleveInput: string = ''; // pour ngModel

  niveaux: any[] = [];
  niveauxFiltres: any[] = [];
  niveauSelectionne: any = null;
  niveauId!: number;
  niveauInput: string = ''; // pour ngModel

  bulletin: any = null;
  message: string | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

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
      }
    });
  }

  private chargerNiveaux(): void {
    this.api.getNiveaux().subscribe({
      next: (data: any) => {
        this.niveaux = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.message = 'Erreur chargement des niveaux';
        this.cdr.detectChanges();
      }
    });
  }

  // ======================
  // Autocomplete Élève
  // ======================
  filtrerEleves(event: any): void {
    const value = event.target.value.toLowerCase();
    this.elevesFiltres = value
      ? this.eleves.filter(e => `${e.nom} ${e.prenom}`.toLowerCase().includes(value))
      : [];
  }

  selectionnerEleve(eleve: any): void {
    this.selectedEleve = eleve;
    this.eleveId = eleve.id;
    this.eleveInput = `${eleve.nom} ${eleve.prenom}`;
    this.elevesFiltres = [];
  }

  // ======================
  // Autocomplete Niveau
  // ======================
  filtrerNiveaux(event: any): void {
    const value = event.target.value.toLowerCase();
    this.niveauxFiltres = value
      ? this.niveaux.filter(n => n.code.toLowerCase().includes(value))
      : [];
  }

  selectionnerNiveau(niveau: any): void {
    this.niveauSelectionne = niveau;
    this.niveauId = niveau.id;
    this.niveauInput = niveau.code;
    this.niveauxFiltres = [];
  }

  // ======================
  // Bulletin / PDF
  // ======================
  genererBulletin() {
    if (!this.eleveId || !this.niveauId) return;

    this.api.getBulletin(this.eleveId, this.niveauId).subscribe({
      next: res => {
        this.bulletin = res;
        this.message = 'Bulletin généré';
      },
      error: err => {
        this.message = 'Erreur génération bulletin';
        console.error(err);
      }
    });
  }

  telechargerPdf() {
    if (!this.eleveId || !this.niveauId) return;

    this.api.downloadBulletinPdf(this.eleveId, this.niveauId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin_${this.eleveId}_${this.niveauId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
