import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.scss']
})
export class DashboardLayout {

    constructor(private router: Router) {}

   logout() {
    // Ici tu peux aussi vider le localStorage/sessionStorage si tu gères un token
    console.log('Déconnexion');
    this.router.navigate(['/login']);
  }
}
