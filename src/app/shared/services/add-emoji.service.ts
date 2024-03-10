import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddEmojiService {

  elemet!: ElementRef;


  /**
   * Adds an emoji to the message text.
   * @param range The current selection range.
   * @param emoji The emoji to be added.
   * @param element The element reference of the message text.
   */
  addEmoji(range: Range | undefined, emoji: string, element: ElementRef | undefined) {
    if (!element || !range) return;
    this.elemet = element;
    if (range && this.isCurserAtMessageText(range)) {
      range.insertNode(document.createTextNode(emoji));
      this.setCurserToEndPos(element);
    } else this.addEmojiToEndOfMessageText(range, emoji);
  }


  /**
   * Checks if the cursor is at the message text.
   * @param range The selection range.
   * @returns A boolean indicating whether the cursor is at the message text.
   */
  isCurserAtMessageText(range: Range): boolean {
    if (!range) return false
    if (!range.commonAncestorContainer.parentElement) return false
    if (range.commonAncestorContainer.parentElement.id === 'messageText') return true
    if (!range.commonAncestorContainer.parentElement.parentElement) return false
    if (!range.commonAncestorContainer.parentElement.parentElement.parentElement) return false
    if (range.commonAncestorContainer.parentElement.parentElement.parentElement.id === 'messageText') return true
    return false
  }


  /**
   * Sets the cursor to the end position of the message text.
   * @param elementRef The element reference of the message text.
   */
  setCurserToEndPos(elementRef?: ElementRef) {
    if (!elementRef || !elementRef.nativeElement) return;
    const divElement = elementRef.nativeElement as HTMLDivElement;
    const range = document.createRange();
    range.selectNodeContents(divElement);
    range.collapse(false);
    const selection = window.getSelection();
    if (!selection) return
    selection.removeAllRanges();
    selection.addRange(range);
  }


  /**
   * Adds an emoji to the end of the message text.
   * @param range The selection range.
   * @param emoji The emoji to be added.
   */
  addEmojiToEndOfMessageText(range: Range, emoji: string) {
    range = document.createRange();
    range.setStart(this.elemet.nativeElement, this.elemet.nativeElement.childNodes.length);
    range.setEnd(this.elemet.nativeElement, this.elemet.nativeElement.childNodes.length);
    range.insertNode(document.createTextNode(emoji));
    this.setCurserToEndPos(this.elemet);
  }
}
