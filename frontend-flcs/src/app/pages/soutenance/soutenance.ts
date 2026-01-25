import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-soutenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soutenance.html',
  styleUrls: ['./soutenance.scss']
})
export class Soutenance implements OnInit {
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

  note!: number;
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
      }
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
      }
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

    this.elevesFiltres = this.eleves.filter(e =>
      `${e.nom} ${e.prenom}`.toLowerCase().includes(value)
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
  // CHOIX NIVEAU
  // ======================
  onNiveauChange(): void {
    this.niveauId = this.niveauSelectionne?.id; // ✅ Définit l’ID pour l’API
  }

  // ======================
  // ENREGISTRER / CONSULTER NOTE
  // ======================
  enregistrerNote(): void {
  if (!this.eleveId || !this.niveauId || this.note == null) {
    this.message = 'Veuillez sélectionner un élève, un niveau et saisir la note';
    return;
  }

  // ✅ Forcer la conversion en nombre
  const payload = {
    eleveId: +this.eleveId,
    niveauId: +this.niveauId,
    note: +this.note
  };

  console.log("Payload envoyé :", payload);

  this.api.attribuerNoteSoutenance(payload).subscribe({
    next: (res: any) => {
      this.message = 'Note de soutenance enregistrée avec succès';
      console.log("Réponse API :", res);
    },
    error: (err: any) => {
      this.message = err.error?.message || 'Erreur lors de l\'enregistrement';
      console.error("Erreur API :", err);
    }
  });
}


  consulterNote(): void {
    if (!this.eleveId || !this.niveauId) {
      this.message = 'Veuillez sélectionner un élève et un niveau';
      return;
    }

    this.api.getNoteSoutenance(this.eleveId, this.niveauId).subscribe({
      next: (res: any) => {
        this.note = res.note;
        this.message = `Note récupérée : ${this.note}`;
      },
      error: () => {
        this.message = 'Note inexistante';
        console.error('Note non trouvée pour cet élève et niveau');
      }
    });
  }
}
