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

  isEdit = false;
  candidatId?: number;
  loading = false;

  // Dropdowns (Listes pour les select)
  niveaux: any[] = [];
  partenaires: any[] = [];
  rentrees: any[] = [];

  // Modèle de données
  candidat: any = {
    nom: '',
    prenom: '',
    dateNaiss: '',
    niveauScolaire: '',
    niveauLangue: '',
    partenaire: '',
    rentree: '',
    telCandidat: '',
    telParent: '',
    typeProcedure: '',
    statut: 'ACTIF'
  };

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef // Injecté pour réveiller Angular
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

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
          niveauScolaire: res.niveauScolaire,
          niveauLangue: res.codeNiveau,   // Mapping vers le select langue
          partenaire: res.nomPartenaire,  // Mapping vers le select partenaire
          rentree: res.nomRentree,        // Mapping vers le select rentrée
          telCandidat: res.telCandidat,
          telParent: res.telParent,
          typeProcedure: res.typeProcedure,
          statut: res.statut
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
    // Préparation de l'objet tel que l'API l'attend
    const payload = {
      nom: this.candidat.nom,
      prenom: this.candidat.prenom,
      dateNaiss: this.candidat.dateNaiss,
      niveauScolaire: this.candidat.niveauScolaire,
      typeProcedure: this.candidat.typeProcedure,
      telCandidat: this.candidat.telCandidat,
      telParent: this.candidat.telParent,
      statut: this.candidat.statut,
      nomRentree: this.candidat.rentree,
      nomPartenaire: this.candidat.partenaire,
      codeNiveau: this.candidat.niveauLangue
    };

    const request = (this.isEdit && this.candidatId) 
      ? this.api.updateEleve(this.candidatId, payload)
      : this.api.createEleve(payload);

    request.subscribe({
      next: () => {
        const msg = this.isEdit ? 'Candidat modifié' : 'Candidat ajouté';
        alert(msg + ' avec succès');
        this.router.navigate(['/app/candidats']);
      },
      error: (err) => {
        console.error('Erreur submit:', err);
        alert('Une erreur est survenue lors de l’opération');
        this.cdr.detectChanges();
      }
    });
  }

  compareFn(o1: any, o2: any): boolean {
  return o1 && o2 ? o1 === o2 : o1 === o2;
}
}