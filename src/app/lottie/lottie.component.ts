import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { loadAnimation, LottieAnimation } from "lottie-web";
export { LottieAnimation as Animation };

@Component({
  selector: "app-lottie",
  template: `
    <div #container></div>
  `
})
export class LottieComponent implements OnDestroy {
  @Input() autoplay = false;
  @Input() reverse = false;
  @Input() loop = false;
  @Input() speed = 1;
  @Input() url!: string;
  @Input() animationData: any;
  @Output() onMount = new EventEmitter<LottieAnimation>();

  @ViewChild("container") container!: ElementRef;
  animationInstance!: LottieAnimation;

  ngOnInit() {
    this.animationInstance = loadAnimation({
      container: this.container.nativeElement,
      path: this.url || undefined,
      animationData: this.animationData || undefined,
      renderer: "svg",
      loop: this.loop,
      autoplay: this.autoplay
    });
    this.animationInstance.setSpeed(this.speed);
    this.animationInstance.addEventListener("DOMLoaded", () => {
      this.onMount.emit(this.animationInstance);
      if (this.reverse) {
        this.animationInstance.setDirection(-1);
        this.animationInstance.goToAndPlay(
          this.animationInstance.getDuration(true),
          true
        );
      }
    });
  }

  ngOnDestroy() {
    console.log("destroy lottie");
    this.animationInstance.destroy();
  }

  play(forward = true) {
    if (this.animationInstance) {
      if (forward) {
        this.animationInstance.setDirection(1);
      } else {
        this.animationInstance.setDirection(-1);
      }
      this.animationInstance.play();
    }
  }
}
