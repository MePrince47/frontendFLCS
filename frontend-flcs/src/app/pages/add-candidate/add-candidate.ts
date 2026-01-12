import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-add-candidate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-candidate.html',
  styleUrls: ['./add-candidate.scss']
})
export class AddCandidate implements OnInit {

  // Mode
  isEdit = false;
  candidatId?: number;

  // Données dropdown
  niveaux: any[] = [];
  partenaires: any[] = [];
  rentrees: any[] = [];

  // Modèle candidat
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSelectData();

    // Vérifie si on est en mode édition
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.candidatId = +id;
      this.loadCandidat(this.candidatId);
    }
  }

  /* ========= Chargement des listes ========= */

  loadSelectData() {
    this.api.getNiveaux().subscribe(res => this.niveaux = res);
    this.api.getPartenaires().subscribe(res => this.partenaires = res);
    this.api.getRentrees().subscribe(res => this.rentrees = res);
  }

  /* ========= Chargement candidat (EDIT) ========= */

  loadCandidat(id: number) {
    this.api.getEleveById(id).subscribe(res => {
      this.candidat = { ...res };
    });
  }

  /* ========= SUBMIT ========= */

  submit() {
    const payload = {
      nom: this.candidat.nom,
      prenom: this.candidat.prenom,
      dateNaiss: this.candidat.dateNaiss,
      niveauScolaire: this.candidat.niveauScolaire,
      typeProcedure: this.candidat.typeProcedure,
      telCandidat: this.candidat.telCandidat,
      telParent: this.candidat.telParent,
      statut: this.candidat.statut,
      nomPartenaire: this.candidat.partenaire, // map
      codeNiveau: this.candidat.niveauLangue     // map
    };

    if (this.isEdit && this.candidatId) {
      this.api.updateEleve(this.candidatId, payload).subscribe({
        next: () => {
          alert('Candidat modifié avec succès');
          this.router.navigate(['/app/candidats']);
        },
        error: err => {
          console.error(err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.api.createEleve(payload).subscribe({
        next: () => {
          alert('Candidat ajouté avec succès');
          this.router.navigate(['/app/candidats']);
        },
        error: err => {
          console.error(err);
          alert('Erreur lors de l’enregistrement');
        }
      });
    }
  }

}
