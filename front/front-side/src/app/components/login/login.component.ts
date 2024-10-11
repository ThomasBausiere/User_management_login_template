import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,   } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl:'./login.component.css',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    // Crée le formulaire avec des validations basiques
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // Méthode de gestion de la soumission du formulaire
  onSubmit() { 
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      // Appel du service d'authentification
      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log('Login réussi', response);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Erreur de login', err);
          console.log(this.errorMessage);
          this.errorMessage = err.error?.message || 'Identifiants invalides. Veuillez réessayer.';
          // Effacer uniquement le champ du mot de passe
          this.loginForm.patchValue({ password: '' });
        }
      });
    }
  }

  // Redirection vers la page d'inscription
  goToSignUpPage() {
    this.router.navigate(['/signin']);
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
