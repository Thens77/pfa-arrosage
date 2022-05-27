import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'espace-vert',
        data: { pageTitle: 'EspaceVerts' },
        loadChildren: () => import('./espace-vert/espace-vert.module').then(m => m.EspaceVertModule),
      },
      {
        path: 'zone',
        data: { pageTitle: 'Zones' },
        loadChildren: () => import('./zone/zone.module').then(m => m.ZoneModule),
      },
      {
        path: 'type-sol',
        data: { pageTitle: 'TypeSols' },
        loadChildren: () => import('./type-sol/type-sol.module').then(m => m.TypeSolModule),
      },
      {
        path: 'plante',
        data: { pageTitle: 'Plantes' },
        loadChildren: () => import('./plante/plante.module').then(m => m.PlanteModule),
      },
      {
        path: 'capteur',
        data: { pageTitle: 'Capteurs' },
        loadChildren: () => import('./capteur/capteur.module').then(m => m.CapteurModule),
      },
      {
        path: 'boitier',
        data: { pageTitle: 'Boitiers' },
        loadChildren: () => import('./boitier/boitier.module').then(m => m.BoitierModule),
      },
      {
        path: 'grandeur',
        data: { pageTitle: 'Grandeurs' },
        loadChildren: () => import('./grandeur/grandeur.module').then(m => m.GrandeurModule),
      },
      {
        path: 'type-plante',
        data: { pageTitle: 'TypePlantes' },
        loadChildren: () => import('./type-plante/type-plante.module').then(m => m.TypePlanteModule),
      },
      {
        path: 'plantation',
        data: { pageTitle: 'Plantations' },
        loadChildren: () => import('./plantation/plantation.module').then(m => m.PlantationModule),
      },
      {
        path: 'arrosage',
        data: { pageTitle: 'Arrosages' },
        loadChildren: () => import('./arrosage/arrosage.module').then(m => m.ArrosageModule),
      },
      {
        path: 'connecte',
        data: { pageTitle: 'Connectes' },
        loadChildren: () => import('./connecte/connecte.module').then(m => m.ConnecteModule),
      },
      {
        path: 'installation',
        data: { pageTitle: 'Installations' },
        loadChildren: () => import('./installation/installation.module').then(m => m.InstallationModule),
      },
      {
        path: 'chart',
        data: { pageTitle: 'Chart' },
        loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
