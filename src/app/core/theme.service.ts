import { isPlatformBrowser } from '@angular/common';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { GlobalObservablesService } from './global-observables.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme = 'light-theme';

  constructor(
    rendererFactory: RendererFactory2,
    public gOService: GlobalObservablesService,
    @Inject(PLATFORM_ID) public _platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme() {
    this.getColorTheme();
    if (isPlatformBrowser(this._platformId)) {
      this.renderer.addClass(document.body, this.colorTheme);
    }
  }

  update(theme: 'dark-theme' | 'light-theme') {
    this.setColorTheme(theme);
    const prevColorTheme =
      theme === 'dark-theme' ? 'light-theme' : 'dark-theme';

    if (isPlatformBrowser(this._platformId)) {
      this.renderer.removeClass(document.body, prevColorTheme);
      this.renderer.addClass(document.body, theme);
    }
    this.gOService.setTheme = theme;
  }

  isDarkMode() {
    return this.colorTheme == 'dark-theme';
  }

  private setColorTheme(theme: string) {
    this.colorTheme = theme;
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('tessa-theme', theme);
    }
  }

  private getColorTheme() {
    let theme: string | null = 'light-theme';
    if (isPlatformBrowser(this._platformId)) {
    }
    theme = localStorage.getItem('tessa-theme');
    if (theme != null) {
      this.colorTheme = theme;
    } else {
      this.colorTheme = 'light-theme';
    }
    return this.colorTheme;
  }
}
