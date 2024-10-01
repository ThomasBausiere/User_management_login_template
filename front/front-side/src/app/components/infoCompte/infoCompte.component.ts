import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // Ajuste le chemin si nécessaire
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)] // Mot de passe facultatif pour modification
    });
  }

  private loadUserData(): void {
    const userId = this.authService.getToken(); // Remplace par l'ID utilisateur si nécessaire
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
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userId = this.authService.getToken(); // Remplace par l'ID utilisateur si nécessaire
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
    }
  }
}
