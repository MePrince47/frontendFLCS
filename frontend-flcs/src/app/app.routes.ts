import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Candidates } from './pages/candidates/candidates';
import { AddCandidate } from './pages/add-candidate/add-candidate';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  { path: 'login', component: Login },

  {
    path: 'app',
    component: DashboardLayout,
    children: [
      { path: 'home', component: Dashboard },
      { path: 'candidats', component: Candidates },
      { path: 'candidats/add', component: AddCandidate },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
