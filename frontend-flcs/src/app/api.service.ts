import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ResumePaiementEleve } from './pages/dashboard/dashboard';

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

  /* =======================
   EVALUATIONS HEBDO (PLANNING)
======================= */

// Générer les 7 semaines pour un niveau
creerEvaluationsPourNiveau(niveauId: number) {
  return this.http.post(`${this.baseUrl}/evaluations-hebdo/niveau/${niveauId}`, {}, { headers: this.authHeader });
}

// Récupérer la liste des semaines d'un niveau
getEvaluationsParNiveau(niveauId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/evaluations-hebdo/niveau/${niveauId}`, { headers: this.authHeader });
}

/* =======================
   NOTES HEBDOMADAIRES
======================= */

saisirNoteHebdo(data: any) {
  return this.http.post(`${this.baseUrl}/notes-hebdo`, data, { headers: this.authHeader });
}

modifierNoteHebdo(noteId: number, data: any) {
  return this.http.put(`${this.baseUrl}/notes-hebdo/${noteId}`, data, { headers: this.authHeader });
}

getNotesHebdoParNiveauEtSemaine(niveauId: number, semaine: number) {
  return this.http.get<any[]>(`${this.baseUrl}/notes-hebdo/niveau/${niveauId}/semaine/${semaine}`, { headers: this.authHeader });
}

getNotesHebdoParEleve(eleveId: number, niveauId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/notes-hebdo/eleve/${eleveId}/niveau/${niveauId}`, { headers: this.authHeader });
}
/* =======================
   ENDPRÜFUNG (EXAMEN FINAL)
======================= */

// Créer l'événement examen
creerEndprufung(data: any) {
  return this.http.post(`${this.baseUrl}/endprufung`, data, { headers: this.authHeader });
}

// Saisir la note finale d'un élève
saisirNoteFinale(data: any) {
  return this.http.post(`${this.baseUrl}/notes-endprufung`, data, { headers: this.authHeader });
}
// Modifier une note finale existante (PUT)
modifierNoteFinale(noteId: number, data: any) {
  return this.http.put(`${this.baseUrl}/notes-endprufung/${noteId}`, data, { headers: this.authHeader });
}

// Récupérer le résultat final d'un élève
getNoteFinaleEleve(eleveId: number, niveauId: number) {
  return this.http.get<any>(`${this.baseUrl}/notes-endprufung/eleve/${eleveId}/niveau/${niveauId}`, { headers: this.authHeader });
}

/* =======================
   RÉSULTATS FINAUX PDF
======================= */

// Télécharger les résultats d’un niveau en PDF
getResultatsNiveauPdf(niveauId: number) {
  return this.http.get(`${this.baseUrl}/resultats/niveau/${niveauId}/pdf`, {
    headers: this.authHeader,
    responseType: 'blob' // pour récupérer un fichier PDF
  });
}

// Télécharger le résultat final d’un élève en PDF
getResultatElevePdf(eleveId: number, niveauId: number) {
  return this.http.get(`${this.baseUrl}/resultats/eleve/${eleveId}/niveau/${niveauId}`, {
    headers: this.authHeader,
    responseType: 'blob'
  });
}

/* =======================
   PAIEMENTS
======================= */

// Enregistrer un paiement (POST déjà existant)
createPaiement(data: any) {
  return this.http.post(`${this.baseUrl}/paiements`, data, { headers: this.authHeader });
}

// Liste des paiements d’un élève
getPaiementsEleve(eleveId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/paiements/eleve/${eleveId}`, { headers: this.authHeader });
}

// Résumé des paiements d’un élève
getResumePaiementsEleve(id: number) {
  return this.http.get<any>(`${this.baseUrl}/paiements/eleves/${id}/resume`, { headers: this.authHeader });
}

// Historique des paiements d’un élève
getHistoriquePaiementsEleve(id: number) {
  return this.http.get<any[]>(`${this.baseUrl}/paiements/eleves/${id}/paiements`, { headers: this.authHeader });
}

// Export PDF des paiements d’un élève
exportPaiementsPdf(eleveId: number) {
  return this.http.get(`${this.baseUrl}/paiements/paiements/export/pdf/${eleveId}`, {
    headers: this.authHeader,
    responseType: 'blob'
  });
}

// Résumé global des paiements de tous les élèves
getResumePaiementsEleves() {
  return this.http.get<ResumePaiementEleve[]>(
    `${this.baseUrl}/paiements/eleves/resume`,
    { headers: this.authHeader }
  );
}

/* =======================
   NIVEAUX – ACTIONS ADMINISTRATIVES
======================= */

// Promotion des élèves d’un niveau
promouvoirNiveau(id: number) {
  return this.http.post(`${this.baseUrl}/niveaux/${id}/promotion`, {}, { headers: this.authHeader });
}

// Clôture d’un niveau
cloturerNiveau(id: number) {
  return this.http.post(`${this.baseUrl}/niveaux/${id}/cloture`, {}, { headers: this.authHeader });
}

/* =======================
   EXAMENS FINAUX – NIVEAU
======================= */

// Récupérer l’examen final d’un niveau
getEndprufungParNiveau(niveauId: number) {
  return this.http.get<any>(`${this.baseUrl}/endprufung/niveau/${niveauId}`, { headers: this.authHeader });
}

// Récupérer les notes finales d’un niveau
getNotesEndprufungParNiveau(niveauId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/notes-endprufung/niveau/${niveauId}`, { headers: this.authHeader });
}


// 🔹 Lister les élèves par rentrée
getElevesByRentree(rentreeId: number | string) {
  return this.http.get<any>(
    `${this.baseUrl}/eleves/rentree/${rentreeId}`,
    { headers: this.authHeader }
  );
}

// 🔹 Lister les élèves par niveau
getElevesByNiveau(niveauId: number | string) {
  return this.http.get<any>(
    `${this.baseUrl}/eleves/niveau/${niveauId}`,
    { headers: this.authHeader }
  );
}


// api.service.ts
genererResultatsNiveau(niveauId: number) {
  return this.http.post(`${this.baseUrl}/resultats/niveau/${niveauId}`, {}, { headers: this.authHeader });
}

genererResultatEleve(eleveId: number, niveauId: number) {
  return this.http.post(`${this.baseUrl}/resultats/eleve/${eleveId}/niveau/${niveauId}`, {}, { headers: this.authHeader });
}
// =======================
// BULLETINS
// =======================

getBulletin(eleveId: number, niveauId: number) {
  return this.http.get<any>(
    `${this.baseUrl}/bulletins/${eleveId}/niveau/${niveauId}`,
    { headers: this.authHeader }
  );
}

downloadBulletinPdf(eleveId: number, niveauId: number) {
  return this.http.get(
    `${this.baseUrl}/bulletins/${eleveId}/niveau/${niveauId}/pdf`,
    { headers: this.authHeader, responseType: 'blob' } // important pour récupérer un PDF
  );
}

// =======================
// SOUTENANCES
// =======================

attribuerNoteSoutenance(payload: { eleveId: number; niveauId: number; note: number }) {
  return this.http.post<any>(
    `${this.baseUrl}/soutenances`,
    payload,
    { headers: this.authHeader }
  );
}

getNoteSoutenance(eleveId: number, niveauId: number) {
  return this.http.get<any>(
    `${this.baseUrl}/soutenances/eleve/${eleveId}/niveau/${niveauId}`,
    { headers: this.authHeader }
  );
}

}
