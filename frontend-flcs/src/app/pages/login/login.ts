import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],  // <-- important
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';

  constructor(private router: Router) {}

  login() {
    if (!this.email || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Appel API plus tard
    console.log('Login:', this.email, this.password);

    this.router.navigate(['/app/home']);
  }
}
