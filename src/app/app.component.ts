import { Component, OnInit, enableProdMode } from '@angular/core';
import { ThemeService } from './core/theme.service';
import { environment } from 'src/environments/enviroment.prod';

if (environment.production) {
  enableProdMode();
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isDarkTheme = false;
  title = 'glambeautysalon';

  constructor(public theme: ThemeService) {}

  ngOnInit(): void {}
}
