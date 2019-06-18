import { Component, OnInit } from "@angular/core"
import { FormControl } from "@angular/forms"
import { LottieAnimation } from "lottie-web"

const SERVER_ROOT = "http://localhost:8090"

interface FolderItem {
  path: string
  serveUrl: string
  label: string
  anim?: LottieAnimation
  debounceTime?: number
}

@Component({
  selector: "app-root",
  template: `
    <h1>app-lottie</h1>

    <ngl-tabset [(selected)]="selectedTab">
      <ngl-tab id="detail">
        <ng-template ngl-tab-label>Detalhe</ng-template>
        <ng-template ngl-tab-content>
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
        </ng-template>
      </ngl-tab>
      <ngl-tab id="list">
        <ng-template ngl-tab-label>Lista</ng-template>
        <ng-template ngl-tab-content>
          <ngl-input label="pasta">
            <input ngl type="text" [formControl]="folder"
          /></ngl-input>
          <button type="button" (click)="loadFolder()">Carregar pasta</button>

          <div class="list" style="display: flex; flex-wrap: wrap;">
            <div *ngFor="let file of folderContents" style="margin:15px;">
              <app-lottie
                [url]="file.serveUrl"
                (mouseover)="mouseover(file)"
                (mouseout)="mouseout(file)"
                (onMount)="setAnimReference($event, file)"
                (click)="click(file)"
              ></app-lottie>
              <label>{{ file.label }}</label>
            </div>
          </div>
        </ng-template>
      </ngl-tab>
    </ngl-tabset>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  loaded = false
  animationData: any
  current = new FormControl(0)
  max = new FormControl(70)
  folder = new FormControl()
  folderContents = [] as FolderItem[]
  SERVER_ROOT = SERVER_ROOT

  selectedTab = "detail" as "detail" | "list"

  async ngOnInit() {
    console.log("init")
    try {
      const resp = await fetch(SERVER_ROOT + "/api/initial-folder")
      const json = await resp.json()
      this.folder.setValue(json.folder)
    } catch (err) {
      console.error(err)
    }
  }

  loadFile(ev) {
    this.loaded = false
    const file = ev.target.files[0]
    const reader = new FileReader()
    reader.onload = (readEv: any) => {
      const resultText = readEv.target.result
      const parsed = JSON.parse(resultText)
      this.animationData = parsed
      this.loaded = true
    }
    reader.readAsText(file)
  }

  valueChange(ev: number) {
    this.current.setValue(ev)
  }

  formSub = this.current.valueChanges.subscribe(value => {
    if (!this.animation) return
    //this.animation.playSegments([value, value + 1], true)
    this.animation.goToAndStop(value, true)
  })

  animation!: LottieAnimation
  onAnimationMount(animation: LottieAnimation) {
    this.animation = animation
  }

  ngOnDestroy() {
    this.formSub.unsubscribe()
  }

  async loadFolder() {
    const folder = encodeURIComponent(this.folder.value)
    const resp = await fetch(SERVER_ROOT + "/api/list-folder?path=" + folder)
    const json = await resp.json()
    this.folderContents = json.files.map(x => ({
      path: x,
      serveUrl: SERVER_ROOT + "/api/serve?path=" + encodeURIComponent(x),
      label: getLabel(x)
    }))
  }

  mouseover(file: FolderItem) {
    const now = new Date().getTime()
    if (file.debounceTime && now < file.debounceTime + 1500) return
    file.debounceTime = now
    if (!file.anim) return
    file.anim!.play()
  }

  mouseout(file: FolderItem) {}

  async click(file: FolderItem) {
    this.selectedTab = "detail"
    this.loaded = false
    const resp = await fetch(file.serveUrl)
    const json = await resp.json()
    this.animationData = json
    this.loaded = true
  }

  setAnimReference(anim: LottieAnimation, item: any) {
    anim.addEventListener("complete", () => {
      anim.goToAndStop(0, true)
    })
    item.anim = anim
  }
}

function getLabel(x: string) {
  const split = x.split(/[\/|\\]/g)
  return split[split.length - 1]
}
