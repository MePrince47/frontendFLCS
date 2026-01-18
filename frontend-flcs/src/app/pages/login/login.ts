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

    // Vérification simple pour l'instant
    if (this.username === 'admin' && this.password === 'admin123') {
      console.log('Connexion réussie !');
      this.router.navigate(['/app/home']);
    } else {
      alert('Identifiants incorrects !');
      this.password = '';
    }
  }
}
