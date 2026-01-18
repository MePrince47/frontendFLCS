import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule ],
  templateUrl: './candidates.html',
  styleUrls: ['./candidates.scss']
})
export class Candidates implements OnInit {

  candidats: any[] = [];
  rentrees: any[] = [];
  niveaux: any[] = [];

  loading = false;

  // Filtres de recherche
  filters = {
    nom: '',
    prenom: '',
    niveauId: '',
    rentreeId: ''
  };

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEleves();
    this.loadRentrees();
    this.loadNiveaux();
  }

  /* =========================
     CHARGEMENT INITIAL
     ========================= */
  loadEleves(): void {
    this.loading = true;

    this.api.getEleves().subscribe({
      next: (res: any) => {
        this.candidats = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRentrees(): void {
    this.api.getRentrees().subscribe({
      next: (res: any) => {
        this.rentrees = res.data || res || [];
        this.cdr.detectChanges();
      },
      error: err => console.error('Erreur chargement rentrées', err)
    });
  }

  loadNiveaux(): void {
    this.api.getNiveaux().subscribe({
      next: (res: any) => {
        this.niveaux = res.data || res || [];
        this.cdr.detectChanges();
      },
      error: err => console.error('Erreur chargement niveaux', err)
    });
  }

  /* =========================
     RECHERCHE AVANCÉE
     ========================= */
  search(): void {
    this.loading = true;

    this.api.searchEleves(this.filters).subscribe({
      next: (res: any) => {
        this.candidats = res.data || res || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur recherche:', err);
        this.loading = false;
      }
    });
  }

  /* =========================
     FILTRE PAR RENTRÉE
     ========================= */
  filterByRentree(rentreeId: string): void {
    if (!rentreeId) {
      this.loadEleves();
      return;
    }

    this.loading = true;
    this.api.getElevesByRentree(rentreeId).subscribe({
      next: (res: any) => {
        this.candidats = res.data || res || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.loading = false
    });
  }

  /* =========================
     FILTRE PAR NIVEAU
     ========================= */
  filterByNiveau(niveauId: string): void {
    if (!niveauId) {
      this.loadEleves();
      return;
    }

    this.loading = true;
    this.api.getElevesByNiveau(niveauId).subscribe({
      next: (res: any) => {
        this.candidats = res.data || res || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.loading = false
    });
  }

  /* =========================
     RÉINITIALISATION
     ========================= */
  resetFilters(): void {
    this.filters = {
      nom: '',
      prenom: '',
      niveauId: '',
      rentreeId: ''
    };
    this.loadEleves();
  }

  /* =========================
     ACTIONS CRUD
     ========================= */
  deleteCandidat(id: number): void {
    if (!confirm('Supprimer ce candidat ?')) return;

    this.api.deleteEleve(id).subscribe(() => {
      this.loadEleves();
    });
  }

  editCandidat(candidat: any): void {
    this.router.navigate(['/app/candidats/edit', candidat.id]);
  }
}
