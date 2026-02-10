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
  private getHeaders() {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin123'),
      'Content-Type': 'application/json'
    });
  }

  constructor(private http: HttpClient) {}

  /* =======================
     UTILISATEURS
  ======================= */

  getUtilisateurs() {
    return this.http.get<any[]>(`${this.baseUrl}/utilisateurs`);
  }

  createUtilisateur(data: any) {
    return this.http.post(`${this.baseUrl}/utilisateurs`, data);
  }

  /* =======================
     PARTENAIRES
  ======================= */

  getPartenaires() {
    return this.http.get<any[]>(`${this.baseUrl}/partenaires`);
  }

  createPartenaire(data: any) {
    return this.http.post(`${this.baseUrl}/partenaires`, data);
  }

  /* =======================
     RENTRÉES
  ======================= */

  getRentrees() {
    return this.http.get<any[]>(`${this.baseUrl}/rentrees`);
  }

  createRentree(data: any) {
    return this.http.post(`${this.baseUrl}/rentrees`, data);
  }

  /* =======================
     NIVEAUX
  ======================= */

  getNiveaux() {
    return this.http.get<any[]>(`${this.baseUrl}/niveaux`);
  }

  createNiveau(data: any) {
    return this.http.post(`${this.baseUrl}/niveaux`, data);
  }

  /* =======================
     ÉLÈVES
  ======================= */

  getEleves() {
    return this.http.get<any[]>(`${this.baseUrl}/eleves`);
  }

  getEleveById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/eleves/${id}`);
  }

  createEleve(data: any) {
    return this.http.post(`${this.baseUrl}/eleves`, data);
  }

  updateEleve(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/eleves/${id}`, data);
  }

  deleteEleve(id: number) {
    return this.http.delete(`${this.baseUrl}/eleves/${id}`);
  }

  searchEleves(filters: any) {
    let params = new HttpParams();

    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    return this.http.get<any>(`${this.baseUrl}/eleves/search`, { headers: this.getHeaders(), params });
  }

  /* =======================
   EVALUATIONS HEBDO (PLANNING)
======================= */

// Générer les 7 semaines pour un niveau
creerEvaluationsPourNiveau(niveauId: number) {
  return this.http.post(`${this.baseUrl}/evaluations-hebdo/niveau/${niveauId}`, {});
}

// Récupérer la liste des semaines d'un niveau
getEvaluationsParNiveau(niveauId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/evaluations-hebdo/niveau/${niveauId}`);
}

/* =======================
   NOTES HEBDOMADAIRES
======================= */

saisirNoteHebdo(data: any) {
  return this.http.post(`${this.baseUrl}/notes-hebdo`, data);
}

modifierNoteHebdo(noteId: number, data: any) {
  return this.http.put(`${this.baseUrl}/notes-hebdo/${noteId}`, data);
}

getNotesHebdoParNiveauEtSemaine(niveauId: number, semaine: number) {
  return this.http.get<any[]>(`${this.baseUrl}/notes-hebdo/niveau/${niveauId}/semaine/${semaine}`);
}

getNotesHebdoParEleve(eleveId: number, niveauId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/notes-hebdo/eleve/${eleveId}/niveau/${niveauId}`);
}
/* =======================
   ENDPRÜFUNG (EXAMEN FINAL)
======================= */

// Créer l'événement examen
creerEndprufung(data: any) {
  return this.http.post(`${this.baseUrl}/endprufung`, data);
}

// Saisir la note finale d'un élève
saisirNoteFinale(data: any) {
  return this.http.post(`${this.baseUrl}/notes-endprufung`, data);
}
// Modifier une note finale existante (PUT)
modifierNoteFinale(noteId: number, data: any) {
  return this.http.put(`${this.baseUrl}/notes-endprufung/${noteId}`, data);
}

// Récupérer le résultat final d'un élève
getNoteFinaleEleve(eleveId: number, niveauId: number) {
  return this.http.get<any>(`${this.baseUrl}/notes-endprufung/eleve/${eleveId}/niveau/${niveauId}`);
}

/* =======================
   RÉSULTATS FINAUX PDF
======================= */

// Télécharger les résultats d’un niveau en PDF
getResultatsNiveauPdf(niveauId: number) {
  return this.http.get(`${this.baseUrl}/resultats/niveau/${niveauId}/pdf`, {
    headers: this.getHeaders(),
    responseType: 'blob' // pour récupérer un fichier PDF
  });
}

// Télécharger le résultat final d’un élève en PDF
getResultatElevePdf(eleveId: number, niveauId: number) {
  return this.http.get(`${this.baseUrl}/resultats/eleve/${eleveId}/niveau/${niveauId}`, {
    headers: this.getHeaders(),
    responseType: 'blob'
  });
}

/* =======================
   PAIEMENTS
======================= */

// Enregistrer un paiement (POST déjà existant)
createPaiement(data: any) {
  return this.http.post(`${this.baseUrl}/paiements`, data);
}

// Liste des paiements d’un élève
getPaiementsEleve(eleveId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/paiements/eleve/${eleveId}`);
}

// Résumé des paiements d’un élève
getResumePaiementsEleve(id: number) {
  return this.http.get<any>(`${this.baseUrl}/paiements/eleves/${id}/resume`);
}

// Historique des paiements d’un élève
getHistoriquePaiementsEleve(id: number) {
  return this.http.get<any[]>(`${this.baseUrl}/paiements/eleves/${id}/paiements`);
}

// Export PDF des paiements d’un élève
exportPaiementsPdf(eleveId: number) {
  return this.http.get(`${this.baseUrl}/paiements/paiements/export/pdf/${eleveId}`, {
    headers: this.getHeaders(),
    responseType: 'blob'
  });
}

// Résumé global des paiements de tous les élèves
getResumePaiementsEleves() {
  return this.http.get<ResumePaiementEleve[]>(
    `${this.baseUrl}/paiements/eleves/resume`,
   
  );
}

/* =======================
   NIVEAUX – ACTIONS ADMINISTRATIVES
======================= */

// Promotion des élèves d’un niveau
promouvoirNiveau(id: number) {
  return this.http.post(`${this.baseUrl}/niveaux/${id}/promotion`, {});
}

// Clôture d’un niveau
cloturerNiveau(id: number) {
  return this.http.post(`${this.baseUrl}/niveaux/${id}/cloture`, {});
}

/* =======================
   EXAMENS FINAUX – NIVEAU
======================= */

// Récupérer l’examen final d’un niveau
getEndprufungParNiveau(niveauId: number) {
  return this.http.get<any>(`${this.baseUrl}/endprufung/niveau/${niveauId}`);
}

// Récupérer les notes finales d’un niveau
getNotesEndprufungParNiveau(niveauId: number) {
  return this.http.get<any[]>(`${this.baseUrl}/notes-endprufung/niveau/${niveauId}`);
}


// 🔹 Lister les élèves par rentrée
getElevesByRentree(rentreeId: number | string) {
  return this.http.get<any>(
    `${this.baseUrl}/eleves/rentree/${rentreeId}`,
   
  );
}

// 🔹 Lister les élèves par niveau
getElevesByNiveau(niveauId: number | string) {
  return this.http.get<any>(
    `${this.baseUrl}/eleves/niveau/${niveauId}`,
   
  );
}


// api.service.ts
genererResultatsNiveau(niveauId: number) {
  return this.http.post(`${this.baseUrl}/resultats/niveau/${niveauId}`, {});
}

genererResultatEleve(eleveId: number, niveauId: number) {
  return this.http.post(`${this.baseUrl}/resultats/eleve/${eleveId}/niveau/${niveauId}`, {});
}
// =======================
// BULLETINS
// =======================

getBulletin(eleveId: number, niveauId: number) {
  return this.http.get<any>(
    `${this.baseUrl}/bulletins/${eleveId}/niveau/${niveauId}`,
   
  );
}

downloadBulletinPdf(eleveId: number, niveauId: number) {
  return this.http.get(
    `${this.baseUrl}/bulletins/${eleveId}/niveau/${niveauId}/pdf`,
    { headers: this.getHeaders(), responseType: 'blob' } // important pour récupérer un PDF
  );
}

// =======================
// SOUTENANCES
// =======================

attribuerNoteSoutenance(payload: { eleveId: number; niveauId: number; note: number }) {
  return this.http.post<any>(
    `${this.baseUrl}/soutenances`,
    payload,
   
  );
}

getNoteSoutenance(eleveId: number, niveauId: number) {
  return this.http.get<any>(
    `${this.baseUrl}/soutenances/eleve/${eleveId}/niveau/${niveauId}`,
   
  );
}

}
