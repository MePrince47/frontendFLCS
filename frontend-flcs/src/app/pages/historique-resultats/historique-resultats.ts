import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-historique-resultats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique-resultats.html',
  styleUrl: './historique-resultats.scss',
})
export class HistoriqueResultats {
eleveId!: number;
  niveauId!: number;

  bulletin: any = null;
  message: string | null = null;

  constructor(private api: ApiService) {}

  genererBulletin() {
    if (!this.eleveId || !this.niveauId) return;

    this.api.getBulletin(this.eleveId, this.niveauId).subscribe({
      next: res => {
        this.bulletin = res;
        this.message = 'Bulletin généré';
        console.log(res);
      },
      error: err => {
        this.message = 'Erreur génération bulletin';
        console.error(err);
      }
    });
  }

  telechargerPdf() {
    if (!this.eleveId || !this.niveauId) return;

    this.api.downloadBulletinPdf(this.eleveId, this.niveauId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin_${this.eleveId}_${this.niveauId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
