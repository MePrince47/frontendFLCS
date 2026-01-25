import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { forkJoin } from 'rxjs'; // Pour charger plusieurs listes proprement

@Component({
  selector: 'app-add-candidate',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './add-candidate.html',
  styleUrls: ['./add-candidate.scss']
})
export class AddCandidate implements OnInit {
  erreurMessage: string | null = null;
  isEdit = false;
  candidatId?: number;
  loading = false;

  // Dropdowns (Listes pour les select)
  niveaux: any[] = [];
  partenaires: any[] = [];
  rentrees: any[] = [];



  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef // Injecté pour réveiller Angular
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.chargerRentrees();
  }
  // Modèle de données
  candidat: any = {
    nom: '',
    prenom: '',
    dateNaiss: '',
    lieuNaiss: '',
    niveauScolaire: '',
    typeProcedure: '',
    montantProcedure: 0,
    telCandidat: '',
    telParent: '',
    codeNiveau: '',
    nomPartenaire: '',
    nomRentree: ''
  };

  /**
   * Charge toutes les données nécessaires au démarrage
   */
  loadInitialData() {
    this.loading = true;

    // On lance toutes les requêtes de listes en parallèle
    forkJoin({
      niveaux: this.api.getNiveaux(),
      partenaires: this.api.getPartenaires(),
      rentrees: this.api.getRentrees()
    }).subscribe({
      next: (res) => {
        this.niveaux = res.niveaux;
        this.partenaires = res.partenaires;
        this.rentrees = res.rentrees;

        // Une fois les listes chargées, on regarde si on est en mode édition
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.isEdit = true;
          this.candidatId = +id;
          this.loadCandidat(this.candidatId);
        } else {
          this.loading = false;
        }
        
        // On force le rafraîchissement
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement listes:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Charge un candidat pour la modification
   */
  loadCandidat(id: number) {
    this.api.getEleveById(id).subscribe({
      next: (res) => {
        // Mapping précis entre les noms de clés API et votre formulaire
        this.candidat = {
          nom: res.nom,
          prenom: res.prenom,
          dateNaiss: res.dateNaiss,
          lieuNaiss: res.lieuNaiss,
          niveauScolaire: res.niveauScolaire,
          typeProcedure: res.typeProcedure,
          montantProcedure: res.montantProcedure,
          telCandidat: res.telCandidat,
          telParent: res.telParent,
          codeNiveau: res.niveauLangue,
          nomPartenaire: res.partenaire,
          nomRentree: res.rentree
        };

        this.loading = false;
        this.cdr.detectChanges(); // Réveil immédiat de la vue
      },
      error: (err) => {
        console.error('Erreur chargement candidat:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Enregistrement (Création ou Modification)
   */
submit() {
  this.erreurMessage = null; // reset erreurs

const payload = {
  nom: this.candidat.nom,
  prenom: this.candidat.prenom,
  dateNaiss: this.candidat.dateNaiss,
  lieuNaiss: this.candidat.lieuNaiss,
  niveauScolaire: this.candidat.niveauScolaire,
  typeProcedure: this.candidat.typeProcedure,
  montantProcedure: this.candidat.montantProcedure,
  telCandidat: this.candidat.telCandidat,
  telParent: this.candidat.telParent,
  codeNiveau: this.candidat.codeNiveau,
  nomPartenaire: this.candidat.nomPartenaire,
  nomRentree: this.candidat.nomRentree
};


  const request = (this.isEdit && this.candidatId) 
    ? this.api.updateEleve(this.candidatId, payload)
    : this.api.createEleve(payload);

  request.subscribe({
    next: () => {
      alert(this.isEdit ? 'Candidat modifié avec succès' : 'Candidat ajouté avec succès');
      this.router.navigate(['/app/candidats']);
    },
    error: (err: any) => {
      console.error('Erreur submit:', err);

      // Extraction du message lisible côté frontend
      if (err.status === 400 && err.error) {
        // Si Spring renvoie un objet avec "message" ou "details"
        if (err.error.details) {
          // On peut parser details pour ne garder que le message humain
          const match = err.error.details.match(/interpolatedMessage='([^']+)'/);
          this.erreurMessage = match ? match[1] : 'Certaines données sont invalides';
        } else if (err.error.message) {
          this.erreurMessage = err.error.message;
        } else {
          this.erreurMessage = 'Certaines données sont invalides';
        }
      } else {
        // Pour toutes les autres erreurs (500, etc.)
        this.erreurMessage = err.message || 'Une erreur est survenue';
      }

      this.cdr.detectChanges();
    }
  });
}



  compareFn(o1: any, o2: any): boolean {
  return o1 && o2 ? o1 === o2 : o1 === o2;
}

// Formulaires additionnels

nouveauNiveau = { nom: '', code: '' };
nouveauPartenaire = { nomPartenaire: '', adresse: '' };
 nouvelleRentree = {
    nomRentree: '',
    dateDebut: ''
  };





  chargerRentrees() {
    this.api.getRentrees().subscribe(res => this.rentrees = res);
  }

  creerRentree() {
  // Réinitialiser l'erreur à chaque submit
  this.erreurMessage = null;

  // Vérifier les champs obligatoires
  if (!this.nouvelleRentree.nomRentree || !this.nouvelleRentree.dateDebut) {
    this.erreurMessage = 'Veuillez remplir tous les champs obligatoires.';
    return;
  }

  const rentreeToPost = {
    nomRentree: this.nouvelleRentree.nomRentree,
    dateDebut: this.nouvelleRentree.dateDebut,
    niveaux: [] // obligatoire pour éviter erreur 500
  };

  this.api.createRentree(rentreeToPost).subscribe({
    next: (res: any) => {
      console.log('Rentrée créée', res);
      this.rentrees.push(res);
      // Réinitialiser le formulaire
      this.nouvelleRentree = { nomRentree: '', dateDebut: '' };
    },
    error: (err: any) => {
      console.error('Erreur création rentrée', err);
      // Si le backend renvoie un objet d'erreurs
      if (err.error && typeof err.error === 'object') {
        const messages = Object.entries(err.error).map(([k, v]) => `${k}: ${v}`);
        this.erreurMessage = messages.join(' | ');
      } else {
        this.erreurMessage = 'Une erreur est survenue lors de la création de la rentrée.';
      }
    }
  });
}



// =======================
// Ajouter un niveau
// =======================
ajouterNiveau() {
  // Réinitialiser l'erreur
  this.erreurMessage = null;

  if (!this.nouveauNiveau.nom || !this.nouveauNiveau.code) {
    this.erreurMessage = 'Veuillez remplir le nom et le code du niveau.';
    return;
  }

  this.api.createNiveau(this.nouveauNiveau).subscribe({
    next: (res: any) => {
      this.niveaux.push(res);
      this.nouveauNiveau = { nom: '', code: '' };
    },
    error: (err: any) => {
      console.error('Erreur création niveau', err);
      if (err.error && typeof err.error === 'object') {
        const messages = Object.entries(err.error).map(([k, v]) => `${k}: ${v}`);
        this.erreurMessage = messages.join(' | ');
      } else {
        this.erreurMessage = 'Une erreur est survenue lors de la création du niveau.';
      }
    }
  });
}

// =======================
// Ajouter un partenaire
// =======================
ajouterPartenaire() {
  // Réinitialiser l'erreur
  this.erreurMessage = null;

  if (!this.nouveauPartenaire.nomPartenaire) {
    this.erreurMessage = 'Veuillez saisir le nom du partenaire.';
    return;
  }

  this.api.createPartenaire(this.nouveauPartenaire).subscribe({
    next: (res: any) => {
      this.partenaires.push(res);
      this.nouveauPartenaire = { nomPartenaire: '', adresse: '' };
    },
    error: (err: any) => {
      console.error('Erreur création partenaire', err);
      if (err.error && typeof err.error === 'object') {
        const messages = Object.entries(err.error).map(([k, v]) => `${k}: ${v}`);
        this.erreurMessage = messages.join(' | ');
      } else {
        this.erreurMessage = 'Une erreur est survenue lors de la création du partenaire.';
      }
    }
  });
}






}