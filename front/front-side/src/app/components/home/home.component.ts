import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class HomeComponent {
  username: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    this.username = this.authService.getUsername(); // Récupérer le nom d'utilisateur lors de l'initialisation du composant
  }
  // Méthode pour déconnecter l'utilisateur
  logout() {
    this.authService.logout(); // Appelle la méthode de déconnexion dans le service d'authentification
    this.router.navigate(['/login']); // Redirection vers la page de login après déconnexion
  }

  goToUpdatePage() {
    this.router.navigate(['/update']);
  }


}
