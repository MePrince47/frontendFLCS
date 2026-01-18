import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-notes-hebdo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-hebdo.html',
})
export class NotesHebdo implements OnInit {
  editionActive = false;

  niveaux: any[] = [];
  semaines: number[] = [];
  notes: any[] = [];

  selectedNiveauId!: number;
  selectedSemaine!: number;

  loading = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadNiveaux();
  }

  /* =====================
     NIVEAUX
     ===================== */
  loadNiveaux() {
    this.api.getNiveaux().subscribe(res => {
      this.niveaux = res;
    });
  }

  /* =====================
     SEMAINES & ÉLÈVES
     ===================== */
  onNiveauChange() {
    if (!this.selectedNiveauId) return;

    this.loading = true;

    // Récupérer les semaines pour ce niveau
    this.api.getEvaluationsParNiveau(this.selectedNiveauId).subscribe({
      next: (res: any) => {
        this.semaines = res.map((e: any) => e.semaineNum); // utiliser semaineNum
        this.notes = []; // réinitialiser les notes
        this.selectedSemaine = null as any;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur récupération semaines:', err);
        this.loading = false;
      }
    });
  }

  /* =====================
     NOTES
     ===================== */
  loadNotes() {
    if (!this.selectedNiveauId || !this.selectedSemaine) return;

    this.loading = true;

    // Récupérer les notes pour ce niveau et cette semaine
    this.api.getNotesHebdoParNiveauEtSemaine(
      this.selectedNiveauId,
      this.selectedSemaine
    ).subscribe({
      next: (res: any) => {
        // Si aucune note existante, créer la liste des élèves pour saisie
        if (!res || res.length === 0) {
          this.loadElevesPourSaisie();
        } else {
          this.notes = res;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur récupération notes:', err);
        this.loading = false;
      }
    });
  }

  // Charger les élèves pour saisie de note si pas de note existante
  loadElevesPourSaisie() {
    this.api.getElevesByNiveau(this.selectedNiveauId).subscribe({
      next: (res: any) => {
        this.notes = res.map((e: any) => ({
          eleveId: e.id,
          nom: e.nom,
          prenom: e.prenom,
          note: null,   // aucune note encore
          id: null      // id null pour futur update
        }));
        this.cdr.detectChanges();
      },
      error: err => console.error('Erreur récupération élèves:', err)
    });
  }

  /* =====================
     ENREGISTREMENT
     ===================== */
  saveNote(note: any) {
    const payload = {
      eleveId: note.eleveId,
      niveauId: this.selectedNiveauId,
      semaine: this.selectedSemaine,
      note: note.note
    };

    if (note.id) {
      this.api.modifierNoteHebdo(note.id, payload).subscribe((res:any) => {
        note.id = res.id; // mettre à jour l'id si modifié
      });
    } else {
      this.api.saisirNoteHebdo(payload).subscribe((res:any) => {
        note.id = res.id; // récupérer l'id pour futur update
      });
    }
  }

  /* =====================
     UTILS
     ===================== */
  activerEdition() {
    this.editionActive = true;
  }

  enregistrer() {
    this.editionActive = false;
  }

  resetSelection() {
    this.selectedNiveauId = null as any;
    this.selectedSemaine = null as any;
    this.semaines = [];
    this.notes = [];
  }
}
