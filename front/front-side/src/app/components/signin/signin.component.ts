import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone:true
})
export class SigninComponent {
  signinForm: FormGroup;
  message: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]  // Champ pour la confirmation du mot de passe
    }, { 
      validators: this.passwordsMatchValidator  // Validation personnalisée pour vérifier la correspondance des mots de passe
    });
  }

  // Validation personnalisée pour vérifier que les mots de passe correspondent
  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  

  onSubmit() {
    if (this.signinForm.valid) {
      const formData = this.signinForm.value;
      this.http.post('http://localhost:3000/api/users', formData)
        .subscribe(
          (response: any) => {
            this.message = 'Inscription réussie!';
            this.router.navigate(['/login']);
          },
          (error) => {
            if (error.status === 400) {
              this.handleErrors(error.error);  // Appel de la fonction de gestion des erreurs
            } else {
              this.message = 'Erreur lors de l\'inscription.';
            }
          }
        );
    } else {
      this.message = 'Veuillez remplir tous les champs correctement.';
    }
  }

  // Gestion des erreurs spécifiques (nom d'utilisateur, email, etc.)
  handleErrors(error: any) {
    if (error.username) {
      this.message = 'Nom d\'utilisateur indisponible.';
    } else if (error.email) {
      this.message = 'Email déjà utilisé ou incorrect.';
    } else if (error.password) {
      this.message = 'Le mot de passe ne respecte pas les exigences.';
    } else {
      this.message = `nom d'utilisateur ou adresse e-mail invalide`;
    }
  }

  goToLoginPage() {
    this.router.navigate(['/login']);
  }
}
