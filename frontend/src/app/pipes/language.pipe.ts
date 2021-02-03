import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

// https://angular.io/guide/pipes
// A pipe takes in data as input and transforms it to a desired output. In this page, you'll use pipes to transform a component's birthday property into a human-friendly date.
@Pipe({ name: 'translateMessage' })
export class TranslateMessagePipe implements PipeTransform {

  constructor(
    private languageService: LanguageService
  ) { }

  transform(value: string, category: string, language?: string): string {
    return this.languageService.GetMessage(category, value, language);
  }
}
