import { Component } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'ac-header',
  standalone: true,
  imports: [RouterLink, Navbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
