import { Routes } from '@angular/router';
import { Projects } from './projects/projects';
import { Contact } from './contact/contact';

export const routes: Routes = [
    {path: 'contact', component: Contact},
    {path: 'projects', component: Projects},
    {path: '**', redirectTo: 'projects'}
]