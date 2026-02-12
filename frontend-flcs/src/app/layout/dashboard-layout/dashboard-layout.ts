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
  userRole: string | null = '';
  userName: string | null = '';

    constructor(private router: Router) {}
  ngOnInit() {
    // Récupération des données stockées lors du login
    this.userRole = localStorage.getItem('userRole');
    this.userName = localStorage.getItem('userName');

    // Si personne n'est connecté, retour forcé au login
    if (!this.userRole) {
      this.router.navigate(['/login']);
    }}
   logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
