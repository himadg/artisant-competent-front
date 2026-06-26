import { Component } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './blog.html',
})
export class BlogPage {}
