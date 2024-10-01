import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports:[ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // Initialisation du formulaire réactif
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Gestion de la soumission du formulaire
  onSubmit() {
    if (this.signinForm.valid) {
      const formData = this.signinForm.value;
      this.http.post('http://localhost:3000/api/users', formData)
        .subscribe(
          (response: any) => {
            this.message = 'Inscription réussie!';
            this.router.navigate(['/login']);  // Redirige vers la page de connexion après l'inscription
          },
          (error) => {
            console.error('Erreur:', error);
            this.message = 'Erreur lors de l\'inscription.';
          }
        );
    } else {
      this.message = 'Veuillez remplir tous les champs correctement.';
    }
  }

  // Redirection vers la page de connexion
  goToLoginPage() {
    this.router.navigate(['/login']);
  }
}
