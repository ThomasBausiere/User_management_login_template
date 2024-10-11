import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { debounceTime, switchMap } from 'rxjs/operators'; // Pour optimiser les appels API
import { of } from 'rxjs'; // Si aucune modification n'est effectuée
import { Router } from '@angular/router';


@Component({
  selector: 'app-info-compte',
  templateUrl: './infoCompte.component.html',
  styleUrls: ['./infoCompte.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class InfoCompteComponent implements OnInit {
  userForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  usernameError: string | null = null;
  emailError: string | null = null;
  passwordMismatch: boolean = false; 
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService, private router: Router) {}
  goBack(): void {
    this.router.navigate(['/home']); // Rediriger vers la page d'accueil
  }
  
  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
    this.setupPasswordMatchListener();
    this.checkUsernameAvailability();
    this.checkEmailAvailability();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)], // Mot de passe (facultatif)
      confirmPassword: ['', Validators.required] // Confirmation du mot de passe
    }, { validators: this.passwordMatchValidator }); // Ajout de la validation du mot de passe
  }
  // Méthode pour valider si les mots de passe correspondent
  private passwordMatchValidator(form: AbstractControl): null | object {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private loadUserData(): void {
    const userId = this.authService.getUserId(); 
    if (userId) {
      this.http.get(`http://localhost:3000/api/users/${userId}`).subscribe(
        (user: any) => {
          this.userForm.patchValue({
            username: user.username,
            email: user.email
          });
        },
        error => {
          this.errorMessage = 'Erreur lors du chargement des données utilisateur.';
        }
      );
    } else {
      this.errorMessage = "ID utilisateur introuvable.";
    }
  }

    // Surveiller les changements dans les champs de mot de passe pour afficher les messages de validation


    private setupPasswordMatchListener(): void {
      this.userForm.valueChanges.subscribe(() => {
        const password = this.userForm.get('password')?.value;
        const confirmPassword = this.userForm.get('confirmPassword')?.value;
        this.passwordMismatch = password && confirmPassword && password !== confirmPassword;
      });
    }

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword;
    }

    private checkUsernameAvailability(): void {
      this.userForm.get('username')?.valueChanges.pipe(
        debounceTime(500), // Attendre que l'utilisateur ait fini de taper
        switchMap(username => {
          if (username) {
            return this.http.get<{ available: boolean }>(`http://localhost:3000/api/users/check-username/${username}`);
          } else {
            return of(null); // Ne rien faire si le champ est vide
          }
        })
      ).subscribe(result => {
        if (result && !result.available) {
          this.usernameError = 'Ce nom d’utilisateur est déjà pris.';
        } else {
          this.usernameError = null;
        }
      });
    }
  
    // Vérifie la disponibilité de l'email
    private checkEmailAvailability(): void {
      this.userForm.get('email')?.valueChanges.pipe(
        debounceTime(500), // Attendre que l'utilisateur ait fini de taper
        switchMap(email => {
          if (email) {
            return this.http.get<{ available: boolean }>(`http://localhost:3000/api/users/check-email/${email}`);
          } else {
            return of(null); // Ne rien faire si le champ est vide
          }
        })
      ).subscribe(result => {
        if (result && !result.available) {
          this.emailError = 'Cet email est déjà utilisé.';
        } else {
          this.emailError = null;
        }
      });
    }

  onSubmit(): void {
    if (this.userForm.valid && !this.passwordMismatch && !this.usernameError && !this.emailError) {
      const userId = this.authService.getUserId(); 
      if (userId) {
        this.http.put(`http://localhost:3000/api/users/${userId}`, this.userForm.value).subscribe(
          response => {
            this.successMessage = 'Informations mises à jour avec succès.';
            this.errorMessage = null;
          },
          error => {
            this.errorMessage = 'Erreur lors de la mise à jour des informations.';
            this.successMessage = null;
          }
        );
      } else {
        this.errorMessage = 'ID utilisateur introuvable.';
      }
    }
  }
  
}
