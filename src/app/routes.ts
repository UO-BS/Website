import { Routes } from '@angular/router';
import { Projects } from './projects/projects';
import { Contact } from './contact/contact';
import { AnimationPage } from './animation-page/animation-page';

export const routes: Routes = [
    {path: 'contact', component: Contact},
    {path: 'projects', component: Projects},
    {path: 'animations', component: AnimationPage},
    {path: '**', redirectTo: 'projects'}
]