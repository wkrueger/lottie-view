import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";
import { LottieAnimation } from "lottie-web";

@Component({
  selector: "app-root",
  template: `
    <h1>app-lottie</h1>
    <input type="file" (change)="loadFile($event)" />

    <div style="max-width: 300px;">
      <app-lottie
        *ngIf="loaded"
        [animationData]="animationData"
        (onMount)="onAnimationMount($event)"
      ></app-lottie>
    </div>
    <div class="controls">
      <ngl-slider
        [value]="current.value"
        (valueChange)="valueChange($event)"
        min="0"
        [max]="max.value"
      ></ngl-slider>
      <ngl-input label="Current">
        <input ngl type="text" [formControl]="current"
      /></ngl-input>
      <ngl-input label="Max">
        <input ngl type="text" [formControl]="max"
      /></ngl-input>
    </div>
  `,
  styles: []
})
export class AppComponent {
  loaded = false;
  animationData: any;
  current = new FormControl(0);
  max = new FormControl(70);

  loadFile(ev) {
    this.loaded = false;
    const file = ev.target.files[0];
    const reader = new FileReader();
    reader.onload = (readEv: any) => {
      const resultText = readEv.target.result;
      const parsed = JSON.parse(resultText);
      this.animationData = parsed;
      this.loaded = true;
    };
    reader.readAsText(file);
  }

  valueChange(ev: number) {
    this.current.setValue(ev);
  }

  formSub = this.current.valueChanges.subscribe(value => {
    if (!this.animation) return;
    //this.animation.playSegments([value, value + 1], true)
    this.animation.goToAndStop(value, true);
  });

  animation!: LottieAnimation;
  onAnimationMount(animation: LottieAnimation) {
    this.animation = animation;
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }
}
