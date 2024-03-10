import { ElementRef, Injectable } from '@angular/core';

/**
 * Service to add emojis into a text field within an Angular application.
 */
@Injectable({
  providedIn: 'root'
})
export class AddEmojiService {

  elemet!: ElementRef;

  /**
   * Adds an emoji at the current cursor position or at the end of the text field if the cursor is not within the text field.
   * @param {Range | undefined} range - The current selection range where the emoji should be inserted.
   * @param {string} emoji - The emoji character to insert.
   * @param {ElementRef | undefined} element - The ElementRef of the text field where the emoji should be added.
   */
  addEmoji(range: Range | undefined, emoji: string, element: ElementRef | undefined) {
    if (!element || !range) return;
    this.elemet = element;
    if (range && this.isCurserAtMessageText(range)) {
      range.insertNode(document.createTextNode(emoji));
      // this.setCurserToEndPos(range);
    } else this.addEmojiToEndOfMessageText(range, emoji);
  }


  /**
   * Checks if the current cursor position is within the message text field.
   * @param {Range} range - The current selection range.
   * @returns {boolean} - True if the cursor is within the message text field, false otherwise.
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
 * Sets the cursor to the end position within the text field.
 * @param {Range} range - The range to set the cursor position.
 */
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


  /**
     * Adds an emoji to the end of the message text field and sets the cursor position after the inserted emoji.
     * @param {Range} range - The current selection range.
     * @param {string} emoji - The emoji character to insert.
     */
  addEmojiToEndOfMessageText(range: Range, emoji: string) {
    range = document.createRange();
    range.setStart(this.elemet.nativeElement, this.elemet.nativeElement.childNodes.length);
    range.setEnd(this.elemet.nativeElement, this.elemet.nativeElement.childNodes.length);
    range.insertNode(document.createTextNode(emoji));
    this.setCurserToEndPos(range);
  }
}
