import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  // Header Basic Auth encodé
  private authHeader = new HttpHeaders({
    Authorization: 'Basic ' + btoa('admin:admin123')
  });

  constructor(private http: HttpClient) {}

  /* =======================
     UTILISATEURS
  ======================= */

  getUtilisateurs() {
    return this.http.get<any[]>(`${this.baseUrl}/utilisateurs`, { headers: this.authHeader });
  }

  createUtilisateur(data: any) {
    return this.http.post(`${this.baseUrl}/utilisateurs`, data, { headers: this.authHeader });
  }

  /* =======================
     PARTENAIRES
  ======================= */

  getPartenaires() {
    return this.http.get<any[]>(`${this.baseUrl}/partenaires`, { headers: this.authHeader });
  }

  createPartenaire(data: any) {
    return this.http.post(`${this.baseUrl}/partenaires`, data, { headers: this.authHeader });
  }

  /* =======================
     RENTRÉES
  ======================= */

  getRentrees() {
    return this.http.get<any[]>(`${this.baseUrl}/rentrees`, { headers: this.authHeader });
  }

  createRentree(data: any) {
    return this.http.post(`${this.baseUrl}/rentrees`, data, { headers: this.authHeader });
  }

  /* =======================
     NIVEAUX
  ======================= */

  getNiveaux() {
    return this.http.get<any[]>(`${this.baseUrl}/niveaux`, { headers: this.authHeader });
  }

  createNiveau(data: any) {
    return this.http.post(`${this.baseUrl}/niveaux`, data, { headers: this.authHeader });
  }

  /* =======================
     ÉLÈVES
  ======================= */

  getEleves() {
    return this.http.get<any[]>(`${this.baseUrl}/eleves`, { headers: this.authHeader });
  }

  getEleveById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/eleves/${id}`, { headers: this.authHeader });
  }

  createEleve(data: any) {
    return this.http.post(`${this.baseUrl}/eleves`, data, { headers: this.authHeader });
  }

  updateEleve(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/eleves/${id}`, data, { headers: this.authHeader });
  }

  deleteEleve(id: number) {
    return this.http.delete(`${this.baseUrl}/eleves/${id}`, { headers: this.authHeader });
  }

  searchEleves(filters: any) {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<any>(`${this.baseUrl}/eleves/search`, { headers: this.authHeader, params });
  }
}
