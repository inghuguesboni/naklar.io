import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StudentComponent } from "./student/student.component";
import { StudentRegisterComponent } from "./student/student-register/student-register.component";
import { TutorComponent } from "./tutor/tutor.component";
import { TutorRegisterComponent } from "./tutor/tutor-register/tutor-register.component";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { LoggedInGuard, NotLoggedInGuard } from "../_helpers";
import { DatabaseResolverService } from "../_services";
import { VerifyComponent } from "./verify/verify.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { ResetRequestComponent } from "./password-reset/reset-request/reset-request.component";

const routes: Routes = [
  {
    path: "account/verify",
    component: VerifyComponent,
  },
  {
    path: "account/password-reset/:token",
    component: PasswordResetComponent,
  },
  {
    path: "account/password-reset",
    pathMatch: "full",
    component: ResetRequestComponent,
  },
  {
    path: "account/student/register",
    component: StudentRegisterComponent,
    resolve: { constants: DatabaseResolverService },
    canActivate: [NotLoggedInGuard],
  },
  {
    path: "account/student",
    component: StudentComponent,
    resolve: { constants: DatabaseResolverService },
  },
  {
    path: "account/tutor/register",
    component: TutorRegisterComponent,
    resolve: { constants: DatabaseResolverService },
    canActivate: [NotLoggedInGuard],
  },
  {
    path: "account/tutor",
    component: TutorComponent,
    resolve: { constants: DatabaseResolverService },
  },
  {
    path: "account/login",
    component: LoginComponent,
    resolve: { constants: DatabaseResolverService },
  },
  {
    path: "account",
    component: ProfileComponent,
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
