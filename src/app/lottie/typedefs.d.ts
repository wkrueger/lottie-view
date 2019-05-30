declare module "lottie-web" {
  export interface LottieAnimation {
    setSpeed(i: number): void;
    setDirection(i: 1 | -1): void;
    play(): void;
    goToAndPlay(to: number, play: boolean): void;
    goToAndStop(to: number, play: boolean): void;
    playSegments(segs: number[] | number[][], force: boolean): void;
    addEventListener(event: string, listener: (...i: any) => any): void;
    destroy(): void;
    getDuration(isFrame: boolean): number;
    renderer: {
      svgElement: SVGElement;
    };
    readonly currentFrame: number;
  }

  export function loadAnimation(i: {
    container: HTMLElement;
    renderer: "svg";
    path?: string;
    loop?: boolean;
    animationData?: any;
    autoplay?: boolean;
  }): LottieAnimation;
}
