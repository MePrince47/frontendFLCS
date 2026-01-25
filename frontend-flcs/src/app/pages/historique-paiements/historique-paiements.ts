import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-historique-paiements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique-paiements.html',
  styleUrls: ['./historique-paiements.scss']
})
export class HistoriquePaiements implements OnInit {
  elevesPaiements: any[] = [];
  loading: boolean = false;
  message: string | null = null;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chargerResumePaiements();
  }

  chargerResumePaiements() {
    this.loading = true;
    this.api.getResumePaiementsEleves().subscribe({
      next: (res: any) => {
        this.elevesPaiements = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = 'Erreur lors du chargement des paiements';
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Export PDF pour un élève
  exportPdf(eleveId: number) {
    this.api.exportPaiementsPdf(eleveId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `paiements_eleve_${eleveId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.message = 'Erreur lors de l’export PDF';
        console.error(err);
      }
    });
  }
}
