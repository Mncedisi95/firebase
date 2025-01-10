import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookRoomComponent } from './components/book-room/book-room.component';
import { AddRoomComponent } from './components/add-room/add-room.component';
import { EditRoomComponent } from './components/edit-room/edit-room.component';

export const routes: Routes = [

    {path:'login', component: SignInComponent},
    {path:'register', component: SignUpComponent},
    {path: 'book-room', component: BookRoomComponent},
    {path: 'add-room', component: AddRoomComponent},
    {path: 'edit-room', component: EditRoomComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'edit-profile', component: EditProfileComponent},
    {path:'forgot-password', component: ForgotPasswordComponent},
    {path: '', redirectTo:'/login', pathMatch: 'full'}
];
