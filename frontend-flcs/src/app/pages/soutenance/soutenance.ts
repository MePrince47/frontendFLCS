import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../api.service';
@Component({
  selector: 'app-soutenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soutenance.html',
  styleUrl: './soutenance.scss',
})
export class Soutenance {
eleveId!: number;
  niveauId!: number;
  note!: number;

  message: string | null = null;

  constructor(private api: ApiService) {}

  enregistrerNote() {
    if (!this.eleveId || !this.niveauId || this.note == null) return;

    this.api.attribuerNoteSoutenance({
      eleveId: this.eleveId,
      niveauId: this.niveauId,
      note: this.note
    }).subscribe({
      next: res => {
        this.message = 'Note de soutenance enregistrée avec succès';
      },
      error: err => {
        this.message = err.error?.message || 'Erreur lors de l\'enregistrement';
        console.error(err);
      }
    });
  }

  consulterNote() {
    if (!this.eleveId || !this.niveauId) return;

    this.api.getNoteSoutenance(this.eleveId, this.niveauId).subscribe({
      next: res => {
        this.note = res.note;
        this.message = `Note récupérée : ${this.note}`;
      },
      error: err => {
        this.message = 'Note inexistante';
        console.error(err);
      }
    });
  }
}
