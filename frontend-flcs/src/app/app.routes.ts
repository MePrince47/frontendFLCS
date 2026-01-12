import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Candidates } from './pages/candidates/candidates';
import { AddCandidate } from './pages/add-candidate/add-candidate';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';
import { CandidateDetails } from './pages/candidate-details/candidate-details';
import { NotesHebdo } from './pages/notes-hebdo/notes-hebdo';
import { ExamenFinal } from './pages/examen-final/examen-final';
import { Bulletin } from './pages/bulletin/bulletin';
import { Register } from './pages/register/register';


export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: 'app',
    component: DashboardLayout,
    children: [
      { path: 'home', component: Dashboard },

      { path: 'candidats', component: Candidates },
      { path: 'candidats/edit/:id', component: AddCandidate },
      { path: 'candidats/add', component: AddCandidate },

      { path: 'candidats/:id', component: CandidateDetails },
      { path: 'notes-hebdo', component: NotesHebdo },
      { path: 'examen-final',component: ExamenFinal},
      { path: 'candidats/:id/bulletin', component: Bulletin },

      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  
  { path: 'register', component: Register },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
