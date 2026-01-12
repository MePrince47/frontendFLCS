import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../api.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './candidates.html',
  styleUrls: ['./candidates.scss']
})
export class Candidates implements OnInit {

  // Utilisation de signals pour garantir la mise à jour de la vue
  candidats: any[] = [];
  loading = false;

  constructor(private api: ApiService, private cdr: ChangeDetectorRef,private router: Router) {}

  ngOnInit(): void {
    this.loadEleves();
  }

  loadEleves() {
    this.loading = true;
    this.api.getEleves().subscribe({
      next: (res: any) => {
        // Force la conversion en tableau
        this.candidats = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
        
        // On force Angular à rafraîchir la vue immédiatement
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('Erreur API:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  deleteCandidat(id: number) {
    if (!confirm('Supprimer ce candidat ?')) return;

    this.api.deleteEleve(id).subscribe(() => {
      this.loadEleves();
    });
  }

  search(filters: any) {
    this.api.searchEleves(filters).subscribe((res: any) => {
      const data = res.data || res;
      this.cdr.detectChanges();
    });
  }

  editCandidat(candidat: any) {
  this.router.navigate(['/app/candidats/edit', candidat.id]);
}
}