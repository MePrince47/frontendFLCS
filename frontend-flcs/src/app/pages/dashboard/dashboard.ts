import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit {

  candidats: any[] = [];
  niveaux: any[] = [];
  rentrees: any[] = [];

  loading: boolean = false;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  /* =========================
     INITIALISATION
     ========================= */
  ngOnInit(): void {
    this.loadEleves();
    this.loadNiveaux();
    this.loadRentrees();
  }

  /* =========================
     CHARGEMENT DES DONNÉES
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
        console.error('Erreur chargement élèves :', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadRentrees(): void {
    this.api.getRentrees().subscribe({
      next: (res: any) => {
        this.rentrees = res?.data || res || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement rentrées :', err);
      }
    });
  }

  loadNiveaux(): void {
    this.api.getNiveaux().subscribe({
      next: (res: any) => {
        this.niveaux = res?.data || res || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement niveaux :', err);
      }
    });
  }


  get totalCandidats(): number {
    return this.candidats?.length || 0;
  }

  get candidatsPayes(): number {
    return this.candidats?.filter(c => c.paye === true).length || 0;
  }

  get candidatsNonPayes(): number {
    return this.candidats?.filter(c => c.paye !== true).length || 0;
  }

}
