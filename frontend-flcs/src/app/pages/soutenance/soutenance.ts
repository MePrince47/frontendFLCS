import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-soutenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soutenance.html',
  styleUrls: ['./soutenance.scss'],
})
export class Soutenance implements OnInit {
  eleveId!: number;
  niveauId!: number;
  note!: number;

  message: string | null = null;

  eleves: any[] = [];
  elevesFiltres: any[] = [];
  selectedEleve: any = null;

  niveaux: any[] = [];
  niveauSelectionne: any = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chargerEleves();
    this.chargerNiveaux();
  }

  /* ======================
     CHARGEMENT DES ELEVES
  ====================== */
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

  /* ======================
     CHARGEMENT DES NIVEAUX
  ====================== */
  chargerNiveaux() {
    this.api.getNiveaux().subscribe(res => {
      this.niveaux = res;

      // ✅ Sélection automatique du premier niveau
      if (this.niveaux.length > 0) {
        this.niveauSelectionne = this.niveaux[0];
        this.niveauId = this.niveauSelectionne.id;
      }

      this.cdr.detectChanges();
    });
  }

  onNiveauChange() {
    if (this.niveauSelectionne) {
      this.niveauId = this.niveauSelectionne.id;
    }
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
    this.elevesFiltres = [];
    this.cdr.detectChanges();
  }

  /* ======================
     ENREGISTRER LA NOTE
  ====================== */
  enregistrerNote() {
    if (!this.eleveId || !this.niveauId || this.note == null) return;

    this.api.attribuerNoteSoutenance({
      eleveId: this.eleveId,
      niveauId: this.niveauId,
      note: this.note
    }).subscribe({
      next: res => {
        this.message = 'Note de soutenance enregistrée avec succès';
        this.cdr.detectChanges();
      },
      error: err => {
        this.message = err.error?.message || 'Erreur lors de l\'enregistrement';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  /* ======================
     CONSULTER LA NOTE
  ====================== */
  consulterNote() {
    if (!this.eleveId || !this.niveauId) return;

    this.api.getNoteSoutenance(this.eleveId, this.niveauId).subscribe({
      next: res => {
        this.note = res.note;
        this.message = `Note récupérée : ${this.note}`;
        this.cdr.detectChanges();
      },
      error: err => {
        this.message = 'Note inexistante';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }
}
