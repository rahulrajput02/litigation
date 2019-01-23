import { RouterModule, Routes } from '@angular/router';

import { createFillingComponent } from './createFilling/createFilling.component';
import { RegisteredAgentComponent } from './registeredAgent/registeredAgent.component';
import { AttorneyComponent } from './attorney/attorney.component';
import { DefendantComponent } from './defendant/defendant.component';
import { LoginComponent } from './login/login.component';

export const appRoutes: Routes = [

    { path: '', component: LoginComponent, pathMatch: "full" },
    { path: 'attorney', component: AttorneyComponent, pathMatch: "full" },
    { path: 'createfilling', component: createFillingComponent },
    { path: 'registeredagent', component: RegisteredAgentComponent },
    { path: 'defendant', component: DefendantComponent }
];

export const routing = RouterModule.forRoot(appRoutes);
