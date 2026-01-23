import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-notes-hebdo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes-hebdo.html',
})
export class NotesHebdo implements OnInit {

  niveaux: any[] = [];
  niveauSelectionne: any = null;

  evaluations: any[] = [];
  evaluationSelectionnee: any = null;

  notes: any[] = [];

  loading = false;
  message = '';

  constructor(private api: ApiService , private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chargerNiveaux();
  }

  /* ======================
     CHARGEMENT DES DONNÉES
  ====================== */

    chargerNiveaux() {
    this.api.getNiveaux().subscribe(res => {
      this.niveaux = res;

      // ✅ Sélection automatique du premier niveau
      if (this.niveaux.length > 0) {
        this.niveauSelectionne = this.niveaux[0];
        this.onNiveauChange();
      }
      this.cd.detectChanges();
    });
  }

onNiveauChange() {
    if (!this.niveauSelectionne) return;

    // Réinitialiser
    this.evaluations = [];
    this.evaluationSelectionnee = null;
    this.eleves = [];
    this.elevesAvecNotes = [];

    // 1️⃣ Charger les élèves
    this.api.getElevesByNiveau(this.niveauSelectionne.id).subscribe(eleves => {
      this.eleves = eleves;

      // 2️⃣ Charger les évaluations
      this.api.getEvaluationsParNiveau(this.niveauSelectionne.id).subscribe(evals => {
        this.evaluations = evals;

        // Sélection automatique de la première semaine
        if (this.evaluations.length > 0) {
          this.evaluationSelectionnee = this.evaluations[0];
          this.onEvaluationChange();
        }

        this.cd.detectChanges();
      });
    });
  }


  /* ======================
     INITIALISER LES NOTES
  ====================== */
  initialiserNotes() {
    this.api.getElevesByNiveau(this.niveauSelectionne.id).subscribe(eleves => {
      const requests = eleves.map((eleve:any) => {
        const payload = {
          evaluationHebdoId: this.evaluationSelectionnee.id,
          eleveId: eleve.id,
          les: 0,
          hor: 0,
          schreib: 0,
          gramm: 0,
          spre: 0
        };
        return this.api.saisirNoteHebdo(payload);
      });

      // Envoyer tous les POST
      Promise.all(requests.map((r:any) => r.toPromise()))
        .then(() => {
          this.api.getNotesHebdoParNiveauEtSemaine(
            this.niveauSelectionne.id,
            this.evaluationSelectionnee.semaineNum
          ).subscribe(res => {
            this.notes = res;
          });
        })
        .catch(err => console.error(err));
    });
  }

  /* ======================
     SAUVEGARDE DES NOTES
  ====================== */
 
  elevesAvecNotes: any[] = [];
  eleves: any[] = [];
// =========================
// AFFICHER LES ÉLÈVES
// =========================
afficherEleves() {
  if (!this.niveauSelectionne) return;

  // 1️⃣ Récupérer les élèves
  this.api.getElevesByNiveau(this.niveauSelectionne.id).subscribe(eleves => {
    this.eleves = eleves;

    // 2️⃣ Récupérer les évaluations hebdo pour ce niveau
    this.api.getEvaluationsParNiveau(this.niveauSelectionne.id).subscribe(evals => {
      this.evaluations = evals;

      // 3️⃣ Initialiser les notes pour la première semaine par défaut
      const premiereEval = this.evaluations[0];
      if (!premiereEval) return;

      // 4️⃣ Créer le tableau des notes
      this.elevesAvecNotes = this.eleves.map(eleve => ({
        eleveId: eleve.id,
        nom: eleve.nom,
        prenom: eleve.prenom,
        evaluationHebdoId: premiereEval.id,
        les: 0,
        hor: 0,
        schreib: 0,
        gramm: 0,
        spre: 0
      }));

      // 5️⃣ Sélectionner la semaine
      this.evaluationSelectionnee = premiereEval;

      // 6️⃣ Forcer la détection Angular pour que tout s'affiche
      this.cd.detectChanges();

      // 7️⃣ Optionnel : charger les notes existantes si elles sont déjà saisies
      this.api.getNotesHebdoParNiveauEtSemaine(
        this.niveauSelectionne.id,
        premiereEval.semaineNum
      ).subscribe(notesExistantes => {
        this.elevesAvecNotes = this.elevesAvecNotes.map(note => {
          const exist = notesExistantes.find(n => n.eleveId === note.eleveId);
          return exist ? { ...note, ...exist } : note;
        });

        // 🔥 Force l'affichage après merge des notes existantes
        this.cd.detectChanges();
      });
    });
  });
}

// Quand tu changes de semaine

onEvaluationChange() {
    if (!this.evaluationSelectionnee || !this.eleves) return;

    // 1️⃣ Construire le tableau des notes pour chaque élève
    this.elevesAvecNotes = this.eleves.map(eleve => ({
      eleveId: eleve.id,
      nom: eleve.nom,
      prenom: eleve.prenom,
      evaluationHebdoId: this.evaluationSelectionnee.id,
      les: 0,
      hor: 0,
      schreib: 0,
      gramm: 0,
      spre: 0
    }));

    // 2️⃣ Charger les notes existantes
    this.api.getNotesHebdoParNiveauEtSemaine(
      this.niveauSelectionne.id,
      this.evaluationSelectionnee.semaineNum
    ).subscribe(notesExistantes => {
      this.elevesAvecNotes = this.elevesAvecNotes.map(note => {
        const exist = notesExistantes.find(n => n.eleveId === note.eleveId);
        return exist ? { ...note, ...exist } : note;
      });

      this.cd.detectChanges(); // 🔥 Force Angular à mettre à jour l'UI
    });
  }

enregistrerNote(note: any) {
  note.loading = true;

  const payload = {
    evaluationHebdoId: note.evaluationHebdoId,
    eleveId: note.eleveId,
    les: note.les,
    hor: note.hor,
    schreib: note.schreib,
    gramm: note.gramm,
    spre: note.spre
  };

  // 🔹 Si la note existe déjà (id présent) → PUT
  if (note.id) {
    this.api.modifierNoteHebdo(note.id, payload).subscribe({
      next: () => {
        note.loading = false;
        this.message = 'Note mise à jour';
        this.cd.detectChanges();
      },
      error: err => {
        note.loading = false;
        this.cd.detectChanges();
        console.error(err);
      }
    });
  } 
  // 🔹 Sinon, vérifier si la note existe déjà dans le tableau local
  else {
const noteExistante = this.notes.find(
  n => n.eleveId === note.eleveId && n.evaluationHebdoId === note.evaluationHebdoId
);

if (noteExistante) {
  // utiliser PUT avec l'id existante
  note.id = noteExistante.id;
  this.enregistrerNote(note);
  return;
}


    // 🔹 Sinon, POST pour créer la note
    this.api.saisirNoteHebdo(payload).subscribe({
      next: (res: any) => {
        note.id = res.id;
        note.loading = false;
        this.message = 'Note enregistrée';
        this.cd.detectChanges();
      },
      error: err => {
        note.loading = false;
        this.cd.detectChanges();
        console.error(err);
      }
    });
  }
}



chargerNotes() {
  if (!this.evaluationSelectionnee || !this.niveauSelectionne) return;

  this.api
    .getNotesHebdoParNiveauEtSemaine(
      this.niveauSelectionne.id,
      this.evaluationSelectionnee.semaineNum
    )
    .subscribe(res => {
      // ⚡ Pour chaque élève, vérifier s'il y a une note
      this.notes = this.eleves.map(eleve => {
        const note = res.find(n => n.eleveId === eleve.id);
        return note
          ? { ...note, eleve } // On garde l'élève dans l'objet note
          : { evaluationHebdoId: this.evaluationSelectionnee.id, eleveId: eleve.id, les:0, hor:0, schreib:0, gramm:0, spre:0, eleve };
      });
    });
}

}
