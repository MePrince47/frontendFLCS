import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit {

  // 💾 Données principales
  candidats: any[] = [];
  niveaux: any[] = [];
  rentrees: any[] = [];

  // 🔄 Loading
  loading = false;

  // 📊 Stats calculées
  totalCandidats = 0;
  candidatsPayes = 0;
  candidatsNonPayes = 0;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  /* =========================
     INITIALISATION
     ========================= */
ngOnInit(): void {
  if (this.candidats.length) {
    this.computeStats();
    this.loading = false; // spinner pas nécessaire
  } else {
    this.loadAllData();
  }
}

  /* =========================
     CHARGEMENT DES DONNÉES ET CALCUL DES STATS
     ========================= */
  loadAllData(): void {
    this.loading = true;
    this.cdr.markForCheck();
  
    forkJoin({
      eleves: this.api.getEleves(),
      rentrees: this.api.getRentrees(),
      niveaux: this.api.getNiveaux()
    }).subscribe({
      next: (res: any) => {
        // 🔹 Normalisation des données
        this.candidats = Array.isArray(res.eleves) 
          ? res.eleves 
          : (res.eleves?.data || []);

        this.rentrees = res.rentrees?.data || res.rentrees || [];
        this.niveaux  = res.niveaux?.data  || res.niveaux  || [];

        // 🔹 Calcul centralisé des stats
        this.computeStats();

        this.loading = false;
        this.cdr.markForCheck(); // Mise à jour finale
      },
      error: (err) => {
        console.error('Erreur globale lors du chargement :', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  /* =========================
     MÉTHODE DE CALCUL DES STATS
     ========================= */
  private computeStats(): void {
    this.totalCandidats = this.candidats.length;
    
    this.candidatsPayes = this.candidats.filter(
      c => c.statut === 'PAYE'
    ).length;

    this.candidatsNonPayes = this.totalCandidats - this.candidatsPayes;
  }

  /* =========================
     MÉTHODES DE RECHARGEMENT INDIVIDUELLES (optionnelles)
     ========================= */
  loadEleves(): void {
    this.loading = true;
    this.api.getEleves().subscribe({
      next: (res: any) => {
        this.candidats = Array.isArray(res) ? res : (res.data || []);
        this.computeStats(); // 🔹 recalcul après reload
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur chargement élèves :', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadRentrees(): void {
    this.api.getRentrees().subscribe({
      next: (res: any) => {
        this.rentrees = res?.data || res || [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement rentrées :', err)
    });
  }

  loadNiveaux(): void {
    this.api.getNiveaux().subscribe({
      next: (res: any) => {
        this.niveaux = res?.data || res || [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur chargement niveaux :', err)
    });
  }

}
