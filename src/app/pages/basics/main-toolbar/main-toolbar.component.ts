import {
  Component,
  ChangeDetectorRef,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { GlobalObservablesService } from 'src/app/core/global-observables.service';
import { ThemeService } from 'src/app/core/theme.service';
import { VariablesService } from 'src/app/core/variables.service';
import { ModelCart } from 'src/app/interfaces/Global.interface';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainToolbarComponent implements OnInit {
  public isDarkTheme = false;
  public mode = 'light_mode';
  mCart: ModelCart[] = [];

  constructor(
    private themeService: ThemeService,
    public router: Router,
    private changeDetector: ChangeDetectorRef,
    public variables: VariablesService,
    public gObservables: GlobalObservablesService
  ) {
    this.themeService.initTheme();
    this.isDarkTheme = this.themeService.isDarkMode();
  }
  async ngOnInit() {
    this.mCart = await this.variables.getCart();

    this.gObservables.getCartAdd.subscribe(async (e) => {
      if (e != '') {
        this.mCart = await this.variables.getCart();
        this.changeDetector.detectChanges();
      }
    });

    this.changeDetector.detectChanges();
  }

  goHome() {
    this.changeDetector.detectChanges();
    this.router.navigate(['']);
  }
  /** BREAK */
  public toggleTheme() {
    this.isDarkTheme = this.themeService.isDarkMode();
    if (this.isDarkTheme) {
      this.mode = 'dark_mode';
    } else {
      this.mode = 'light_mode';
    }

    this.isDarkTheme
      ? this.themeService.update('light-theme')
      : this.themeService.update('dark-theme');

    this.changeDetector.detectChanges();
  }
  goCatalog() {
    this.router.navigate(['catalog']);
  }
  goCart() {
    this.router.navigate(['cart/mi-pedido']);
  }
}
