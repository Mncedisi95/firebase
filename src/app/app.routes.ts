import { Routes } from '@angular/router';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookRoomComponent } from './components/book-room/book-room.component';
import { AddRoomComponent } from './components/add-room/add-room.component';
import { EditRoomComponent } from './components/edit-room/edit-room.component';
import { RoomDetailsComponent } from './components/room-details/room-details.component';
import { ViewBookingComponent } from './components/view-booking/view-booking.component';
import { EditBookingComponent } from './components/edit-booking/edit-booking.component';
import { ManageBookingsComponent } from './components/manage-bookings/manage-bookings.component';
import { BookingDetailsComponent } from './components/booking-details/booking-details.component';
import { IndexComponent } from './components/index/index.component';
import { ManageGuestsComponent } from './components/manage-guests/manage-guests.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { GuestDetailsComponent } from './components/guest-details/guest-details.component';

export const routes: Routes = [

    {path: 'index', component: IndexComponent},
    {path:'login', component: SignInComponent},
    {path:'register', component: SignUpComponent},
    {path: 'rooms',component: RoomsComponent},
    {path: 'book-room', component: BookRoomComponent},
    {path: 'view-booking', component: ViewBookingComponent},
    {path: 'edit-booking', component: EditBookingComponent},
    {path: 'manage-bookings', component: ManageBookingsComponent},
    {path: 'booking-details', component: BookingDetailsComponent},
    {path: 'manage-guests', component: ManageGuestsComponent},
    {path: 'guest-details', component: GuestDetailsComponent},
    {path: 'add-room', component: AddRoomComponent},
    {path: 'edit-room', component: EditRoomComponent},
    {path: 'room-details', component: RoomDetailsComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'edit-profile', component: EditProfileComponent},
    {path:'forgot-password', component: ForgotPasswordComponent},
    {path: '', redirectTo:'/index', pathMatch: 'full'}
];
