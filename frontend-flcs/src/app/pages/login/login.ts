import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html'
})
export class Login {
  username = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    if (!this.username || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    let role = '';

    // Vérification des identifiants
    if (this.username === 'admin' && this.password === 'admin123') {
      role = 'ADMIN';
    } else if (this.username === 'Secretaire' && this.password === 'secretaire811') {
      role = 'SECRETAIRE';
    }

    if (role !== '') {
      // On stocke les infos pour que l'app s'en souvienne
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', this.username);
      
      console.log(`Connexion réussie en tant que : ${role}`);
      this.router.navigate(['/app/home']);
    } else {
      alert('Identifiants incorrects !');
      this.password = '';
    }
  }
}
