import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './register.html'
})
export class Register {

  nom = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  register() {
    if (!this.nom || !this.email || !this.password || !this.confirmPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Ici tu appelleras ton API
    console.log('Nouvel utilisateur :', {
      nom: this.nom,
      email: this.email,
      password: this.password
    });

    alert('Inscription réussie !');

    // Redirection vers login
    this.router.navigate(['/login']);
  }
}
