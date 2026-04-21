import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'ac-header',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
