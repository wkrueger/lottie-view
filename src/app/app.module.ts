import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NglModule } from "ng-lightning";

import { AppComponent } from "./app.component";
import { LottieComponent } from "./lottie/lottie.component";

@NgModule({
  declarations: [AppComponent, LottieComponent],
  imports: [BrowserModule, ReactiveFormsModule, FormsModule, NglModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
