import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddEmojiService {

  elemet!: ElementRef;

  addEmoji(range: Range | undefined, emoji: string, element: ElementRef | undefined) {
    if (!element || !range) return;
    this.elemet = element;
    if (range && this.isCurserAtMessageText(range)) {
      range.insertNode(document.createTextNode(emoji));
      // this.setCurserToEndPos(range);
    } else this.addEmojiToEndOfMessageText(range, emoji);
  }


  isCurserAtMessageText(range: Range): boolean {
    if (!range) return false
    if (!range.commonAncestorContainer.parentElement) return false
    if (range.commonAncestorContainer.parentElement.id === 'messageText') return true
    if (!range.commonAncestorContainer.parentElement.parentElement) return false
    if (!range.commonAncestorContainer.parentElement.parentElement.parentElement) return false
    if (range.commonAncestorContainer.parentElement.parentElement.parentElement.id === 'messageText') return true
    return false
  }


  setCurserToEndPos(range: Range) {
    if (!range) return
    const selection = window.getSelection();
    if (!selection) return;
    const newPosition = range.endOffset;
    range.setStart(this.elemet.nativeElement, newPosition);
    range.setEnd(this.elemet.nativeElement, newPosition);
    selection.removeAllRanges();
    selection.addRange(range);
  }


  addEmojiToEndOfMessageText(range: Range, emoji: string) {
    range = document.createRange();
    range.setStart(this.elemet.nativeElement, this.elemet.nativeElement.childNodes.length);
    range.setEnd(this.elemet.nativeElement, this.elemet.nativeElement.childNodes.length);
    range.insertNode(document.createTextNode(emoji));
    this.setCurserToEndPos(range);
  }
}
