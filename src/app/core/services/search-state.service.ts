import { Injectable, signal } from '@angular/core';

export interface SearchState {
  professionalIds: string[];
  tradeId: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private state = signal<SearchState | null>(null);

  getState() {
    return this.state();
  }

  setState(newState: SearchState) {
    this.state.set(newState);
  }

  clearState() {
    this.state.set(null);
  }
}
