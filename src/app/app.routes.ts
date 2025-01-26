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
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { RoomsAdminComponent } from './components/rooms-admin/rooms-admin.component';
import { RoomDetailsAdminComponent } from './components/room-details-admin/room-details-admin.component';
import { RoomAvailabilityComponent } from './components/room-availability/room-availability.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { LeaveReviewComponent } from './components/leave-review/leave-review.component';

export const routes: Routes = [

  { path: 'index', component: IndexComponent },
  { path: 'login', component: SignInComponent },
  { path: 'register', component: SignUpComponent },
  { path: 'rooms', component: RoomsComponent },
  { path: 'book-room/:id', component: BookRoomComponent, canActivate: [authGuard] },
  { 
    path: 'view-booking',
    component: ViewBookingComponent, 
    canActivate: [authGuard, roleGuard],
    data: {roles: ['guest']}
  },
  {
    path: 'rooms-admin',
    component: RoomsAdminComponent,
    canActivate: [authGuard, roleGuard],
    data: {roles: ['admin']}
  },
  {
    path: 'room-details-admin/:id',
    component: RoomDetailsAdminComponent,
    canActivate: [authGuard],
    data: {roles: ['admin']}
  },
  {
    path: 'edit-booking', 
    component: EditBookingComponent, 
    canActivate: [authGuard],
    data: {roles: ['admin']}
  },
  {
    path: 'manage-bookings',
    component: ManageBookingsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] }, 
  },
  {
    path: 'booking-details/:id',
    component: BookingDetailsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'staff'] },
  },
  {
    path: 'manage-guests',
    component: ManageGuestsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'guest-details',
    component: GuestDetailsComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'add-room',
    component: AddRoomComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'edit-room/:id',
    component: EditRoomComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'room-availability',
    component: RoomAvailabilityComponent,
    canActivate: [authGuard, roleGuard],
    data: {roles: ['admin']}
  },
  {
    path: 'room-details/:id',
    component: RoomDetailsComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: {roles: ['admin']}
  },
  {
    path: 'edit-profile/:id',
    component: EditProfileComponent,
    canActivate: [authGuard, roleGuard],
    data: {roles: ['guest']}
  },
  {
    path: 'view-profile',
    component: ViewProfileComponent,
    canActivate : [authGuard, roleGuard],
    data: {roles : ['guest']}
  },
  {
    path: 'payment/:bookingId',
    component: PaymentComponent,
    canActivate : [authGuard,roleGuard],
    data: {roles : ['guest']}
  },
  {
    path: 'leave-review/:roomId',
    component: LeaveReviewComponent,
  },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
];
