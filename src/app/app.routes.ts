import { Routes } from '@angular/router';
import { LoginComponent } from './components/general/login/login.component';
import { IndexComponent } from './components/general/index/index.component';
import { ForgotPasswordComponent } from './components/general/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/general/register/register.component';
import { AboutComponent } from './components/general/about/about.component';
import { ContactComponent } from './components/general/contact/contact.component';
import { ServicesComponent } from './components/general/services/services.component';
import { RoomsComponent } from './components/user/rooms/rooms.component';
import { ViewBookingComponent } from './components/user/view-booking/view-booking.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { ViewProfileComponent } from './components/user/view-profile/view-profile.component';
import { UnauthorizedComponent } from './components/admin/unauthorized/unauthorized.component';
import { AddRoomComponent } from './components/admin/add-room/add-room.component';
import { AddUserComponent } from './components/admin/add-user/add-user.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { EditRoomComponent } from './components/admin/edit-room/edit-room.component';
import { BookRoomComponent } from './components/user/book-room/book-room.component';
import { BookingDetailsComponent } from './components/admin/booking-details/booking-details.component';
import { EditBookingComponent } from './components/admin/edit-booking/edit-booking.component';
import { GuestDetailsComponent } from './components/admin/guest-details/guest-details.component';
import { LeaveReviewComponent } from './components/user/leave-review/leave-review.component';
import { ManageBookingsComponent } from './components/admin/manage-bookings/manage-bookings.component';
import { ManageGuestsComponent } from './components/admin/manage-guests/manage-guests.component';
import { PaymentComponent } from './components/user/payment/payment.component';
import { RoomAvailabilityComponent } from './components/admin/room-availability/room-availability.component';
import { RoomDetailsComponent } from './components/user/room-details/room-details.component';
import { RoomDetailsAdminComponent } from './components/admin/room-details-admin/room-details-admin.component';
import { RoomsAdminComponent } from './components/admin/rooms-admin/rooms-admin.component';

export const routes: Routes = [

    { path: 'index', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'rooms', component: RoomsComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'services', component: ServicesComponent },
    {
        path: 'view-profile',
        component: ViewProfileComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['guest'] }
    },
    {
        path: 'book-room',
        component: BookRoomComponent,
        canActivate: [authGuard]
    },
    {
        path: 'edit-booking',
        component: EditBookingComponent,
        canActivate: [authGuard],
        data: { roles: ['admin'] }
    }, {
        path: 'manage-bookings',
        component: ManageBookingsComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'view-booking',
        component: ViewBookingComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['guest'] }
    },
    {
        path: 'booking-details',
        component: BookingDetailsComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin', 'staff'] },
    },
    {
        path: 'add-room',
        component: AddRoomComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] },
    },
    {
        path: 'room-details',
        component: RoomDetailsComponent,
    },
    {
        path: 'rooms-admin',
        component: RoomsAdminComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin', 'staff'] }
    },
    {
        path: 'room-details-admin',
        component: RoomDetailsAdminComponent,
        canActivate: [authGuard],
        data: { roles: ['admin', 'staff'] }
    },
    {
        path: 'edit-room',
        component: EditRoomComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] },
    },
    {
        path: 'add-user',
        component: AddUserComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] }
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
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin', 'staff'] }
    },
    {
        path: 'room-availability',
        component: RoomAvailabilityComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] }
    },
    {
        path: 'payment',
        component: PaymentComponent,
        canActivate: [authGuard, roleGuard],
        data: { roles: ['guest'] }
    },
    {
        path: 'leave-review',
        component: LeaveReviewComponent,
        canActivate: [authGuard]
    },
    { path: 'unauthorized', component: UnauthorizedComponent },
    { path: '', redirectTo: '/index', pathMatch: 'full' }
];
