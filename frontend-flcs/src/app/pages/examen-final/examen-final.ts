import { Component, OnInit, ChangeDetectorRef,NgZone  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-examen-final',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './examen-final.html',
  styleUrls: ['./examen-final.scss']
})
export class ExamenFinal implements OnInit {

  niveaux: any[] = [];
  niveauSelectionne: any = null;

  examenFinal: any = null;

  eleves: any[] = [];
  notesFinales: any[] = [];

  loading = false;
  message = '';
  error = '';

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
  ) {}

  ngOnInit() {
    this.chargerNiveaux();
  }

  /* ==========================
     CHARGEMENT DES NIVEAUX
  ========================== */
 chargerNiveaux() {
  this.api.getNiveaux().subscribe({
    next: (niveaux) => {
      // ⚡️ S’assurer qu’on est dans Angular zone
      this.zone.run(() => {
        this.niveaux = niveaux;
        this.cdr.detectChanges(); // rafraîchit la vue
      });
    },
    error: (err) => {
      this.zone.run(() => {
        console.error(err);
        this.error = 'Impossible de charger les niveaux';
        this.cdr.detectChanges();
      });
    }
  });
}
  /* ==========================
     CHANGEMENT DE NIVEAU
  ========================== */
  onNiveauChange() {
  if (!this.niveauSelectionne) return;

  this.loading = true;
  this.message = '';
  this.error = '';
  this.cdr.detectChanges();

  this.api.getEndprufungParNiveau(this.niveauSelectionne.id).subscribe({
    next: exam => {
      // Examen trouvé
      this.examenFinal = exam;
      this.chargerElevesEtNotes();
    },
    error: (err) => {
      console.warn('Examen non trouvé, création en cours...', err);

      // Créer un nouvel examen avec date du jour
      const payload = {
        niveauId: this.niveauSelectionne.id,
        dateExam: new Date().toISOString().split('T')[0] // YYYY-MM-DD
      };

      this.api.creerEndprufung(payload).subscribe({
        next: exam => {
          this.examenFinal = exam;
          this.chargerElevesEtNotes();
        },
        error: (err) => {
          console.error('Erreur création examen final:', err);
          this.error = 'Impossible de créer l’examen final';
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  });
}


  /* ==========================
     ÉLÈVES + NOTES
  ========================== */
chargerElevesEtNotes() {
  this.api.getElevesByNiveau(this.niveauSelectionne.id).subscribe(eleves => {
    this.eleves = eleves;

    this.api.getNotesEndprufungParNiveau(this.niveauSelectionne.id).subscribe(notes => {

    this.notesFinales = this.eleves.map(eleve => {
      const noteExistante = notes.find((n: any) => n.eleveId === eleve.id);
      return {
        eleveId: eleve.id,
        nom: eleve.nom,
        prenom: eleve.prenom,
        endprufungId: this.examenFinal.id,
        les: noteExistante?.les ?? 0,
        hor: noteExistante?.hor ?? 0,
        schreib: noteExistante?.schreib ?? 0,
        gramm: noteExistante?.gramm ?? 0,
        spre: noteExistante?.spre ?? 0,
        id: noteExistante?.id, // utile pour PUT
        loading: false
      };
    });


      this.loading = false;
      this.cdr.detectChanges();
    });
  });
}

  /* ==========================
     ENREGISTREMENT NOTE (POST)
  ========================== */
enregistrerNote(note: any) {
  note.loading = true;
  this.message = '';
  this.error = '';
  this.cdr.detectChanges();

  const payload = {
    eleveId: note.eleveId,
    endprufungId: note.endprufungId,
    les: note.les ?? 0,
    hor: note.hor ?? 0,
    schreib: note.schreib ?? 0,
    gramm: note.gramm ?? 0,
    spre: note.spre ?? 0
  };

  if (note.id) {
    // MODIFIER la note existante → PUT
    this.api.modifierNoteFinale(note.id, payload).subscribe({
      next: (res: any) => {
        note.loading = false;
        this.message = 'Note mise à jour';
        this.cdr.detectChanges();
      },
      error: (err) => {
        note.loading = false;
        this.error = `Erreur lors de la mise à jour: ${err.status} ${err.statusText}`;
        console.error(err); // pour déboguer le serveur
        this.cdr.detectChanges();
      }
    });
  } else {
    // NOUVELLE note → POST
    this.api.saisirNoteFinale(payload).subscribe({
      next: (res: any) => {
        note.loading = false;
        note.id = res.id; // stocker l'ID pour PUT futur
        this.message = 'Note enregistrée';
        this.cdr.detectChanges();
      },
      error: (err) => {
        note.loading = false;
        this.error = `Erreur lors de l’enregistrement: ${err.status} ${err.statusText}`;
        console.error(err); // pour déboguer le serveur
        this.cdr.detectChanges();
      }
    });
  }
}


}
