import 'iconify-icon';
import { addCollection } from '@iconify/iconify';
import lucide from '@iconify-json/lucide/icons.json';
import circleFlags from '@iconify-json/circle-flags/icons.json';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

addCollection(lucide);
addCollection(circleFlags);

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
