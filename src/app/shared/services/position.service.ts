import { ElementRef, Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { DialogPosition } from "@angular/material/dialog";
import { BehaviorSubject, fromEvent, Observable, combineLatest, of } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface ElementPos {
    y: number,
    h: number,
    x: number,
    w: number,
}

/**
 * Provides utility functions for managing dialog positions, responsive window states, and menu visibility.
 * It also handles window resize events to adjust the UI accordingly.
 */
@Injectable({
    providedIn: 'root'
})

export class PositionService {
    private menuOpen = new BehaviorSubject<boolean>(true); // Standardmäßig ist das Menü geöffnet
    private responsiveActiveWindow = new BehaviorSubject<"menu" | "channel">("menu");
    private responsiveThreadWindow = new BehaviorSubject<Boolean>(false);
    private responsiveChannelWindow = new BehaviorSubject<Boolean>(true);
    private windowWidth = new BehaviorSubject<number>(0); // Initialwert auf 0

    /**
    * Initializes window width and sets up a subscription to window resize events.
    */
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.windowWidth.next(window.innerWidth);
            fromEvent(window, 'resize')
                .pipe(
                    debounceTime(100),
                    map(() => window.innerWidth),
                    startWith(window.innerWidth)
                )
                .subscribe(width => this.windowWidth.next(width));
        }
    }

    /**
         * Calculates and returns the dialog position based on the provided element.
         * @param {ElementRef | undefined} element - The reference to the element for which to calculate the dialog position.
         * @returns {DialogPosition | undefined} - The calculated position or undefined if the element is not provided.
         */
    getDialogPos(element: ElementRef | undefined): DialogPosition | undefined {
        if (!element) return undefined
        const windowH = window.innerHeight;
        let pos: ElementPos;
        let e: any = element;
        pos = this.getElementPos(e._elementRef.nativeElement)
        return { bottom: windowH - pos.y + 'px', left: pos.x + 'px' }
    }


    /**
     * Calculates and returns the emoji dialog position based on the provided element.
     * @param {ElementRef | undefined} element - The reference to the element for which to calculate the emoji dialog position.
     * @returns {DialogPosition | undefined} - The calculated position or undefined if the element is not provided.
     */
    getDialogPosEmojy(element: ElementRef | undefined): DialogPosition | undefined {
        if (!element) return undefined
        const windowH = window.innerHeight;
        const windowW = window.innerWidth;
        let pos: ElementPos;
        let e: any = element;
        pos = this.getElementPos(e._elementRef.nativeElement)
        if (pos.x < (windowW / 2)) return { bottom: windowH - pos.y + 'px', left: pos.x + 'px' }
        else return { bottom: windowH - pos.y + 'px', right: windowW - pos.x - pos.w + 'px' }
    }

    /**
 * Calculates and returns the dialog position with a specific corner based on the provided element and corner position.
 * @param {ElementRef | undefined} element - The reference to the element for which to calculate the dialog position.
 * @param {'right' | 'left' | 'bottom-right' | 'bottom-left'} cornerPos - The corner position for the dialog.
 * @param {number} [xOffset] - Optional X offset to adjust the position.
 * @returns {DialogPosition | undefined} - The calculated position or undefined if the element is not provided.
 */
    getDialogPosWithCorner(element: ElementRef | undefined, cornerPos: 'right' | 'left' | 'bottom-right' | 'bottom-left', xOffset?: number): DialogPosition | undefined {
        if (!element) return undefined
        const windowH = window.innerHeight;
        const windowW = window.innerWidth;
        let pos: ElementPos;
        if (element.nativeElement) pos = this.getElementPos(element.nativeElement);
        else {
            let e: any = element;
            pos = this.getElementPos(e._elementRef.nativeElement)
        }
        if (xOffset) pos.x = pos.x + xOffset;
        if (cornerPos === 'right') return { top: pos.y + pos.h + 'px', right: windowW - pos.x - pos.w + 'px' }
        else if (cornerPos === 'bottom-right') return { bottom: windowH - pos.y + 'px', right: windowW - pos.x - pos.w + 'px' }
        else if (cornerPos === 'bottom-left') return { bottom: windowH - pos.y + 'px', left: pos.x + 'px' }
        else return { top: pos.y + pos.h + 'px', left: pos.x + 'px' }
    }

    /**
  * Retrieves the position of an HTML element.
  * @param {any} element - The HTML element to calculate position for.
  * @returns {ElementPos} - The position of the element including its x, y coordinates, width, and height.
  */
    getElementPos(element: any): ElementPos {
        return {
            y: element.getBoundingClientRect().y,
            h: element.getBoundingClientRect().height,
            x: element.getBoundingClientRect().x,
            w: element.getBoundingClientRect().width,
        }
    }

    /**
    * Toggles the visibility state of the menu.
    */
    toggleMenu() {
        this.menuOpen.next(!this.menuOpen.value);
    }

    /**
     * Returns the current visibility state of the menu.
     * @returns {Observable<boolean>} - An observable of the menu's visibility state.
     */
    isMenuOpen(): Observable<boolean> {
        return this.menuOpen.asObservable();
    }

    /**
     * Sets the active responsive window state.
     * @param {"menu" | "channel"} value - The responsive window state to set.
     */
    setActiveResponsiveWindow(value: "menu" | "channel") {
        this.responsiveActiveWindow.next(value);
    }

    /**
 * Gets the currently active responsive window.
 * @returns {Observable<string>} - An observable that emits the current active window.
 */
    getActiveResponsiveWindow(): Observable<string> {
        return this.responsiveActiveWindow.asObservable();
    }

    /**
  * Checks if a specific responsive window is visible.
  * @param {"menu" | "channel"} value - The responsive window to check.
  * @returns {Observable<boolean>} - An observable that emits true if the specified window is visible, otherwise false.
  */
    isResponsiveWindowVisible(value: "menu" | "channel"): Observable<boolean> {
        const mobileBreakpoint = 1000; // muss analog der styles.scss $tablet-breakpoint sein
        return combineLatest([
            this.windowWidth.asObservable(),
            this.responsiveActiveWindow.asObservable()
        ]).pipe(
            map(([width, currentValue]) => {
                if (width > mobileBreakpoint) {
                    return true;
                } else {
                    return currentValue === value;
                }
            })
        );
    }

    /**
     * Sets the visibility state for the thread responsive window.
     * @param {Boolean} value - The visibility state to set for the thread window.
     */
    setThreadResponsiveWindow(value: Boolean) {
        this.responsiveThreadWindow.next(value);
        this.responsiveChannelWindow.next(!value);
    }

    /**
 * Gets the visibility state of the thread responsive window.
 * @returns {Observable<Boolean>} - An observable that emits the visibility state of the thread window.
 */
    getThreadResponsiveWindow(): Observable<Boolean> {
        return this.responsiveThreadWindow.asObservable();
    }

    /**
    * Determines if the thread window is visible in responsive mode.
    * @returns {Observable<Boolean>} - An observable indicating whether the thread window is visible.
    */
    isThreadWindowVisible(): Observable<Boolean> {
        const mobileBreakpoint = 1000; // muss analog der styles.scss $tablet-breakpoint sein
        return combineLatest([
            this.windowWidth.asObservable(),
            this.responsiveThreadWindow.asObservable()
        ]).pipe(
            map(([width, isThreadVisible]) => {
                if (width > mobileBreakpoint) {
                    return true;
                } else {
                    return isThreadVisible;
                }
            })
        );
    }

    /**
      * Sets the visibility state for the channel responsive window.
      * @param {Boolean} value - The visibility state to set for the channel window.
      */
    setChannelResponsiveWindow(value: Boolean) {
        this.responsiveChannelWindow.next(value);
    }

    /**
     * Gets the visibility state of the channel responsive window.
     * @returns {Observable<Boolean>} - An observable that emits the visibility state of the channel window.
     */
    getChannelResponsiveWindow(): Observable<Boolean> {
        return this.responsiveChannelWindow.asObservable();
    }

    /**
 * Determines if the channel window is visible in responsive mode.
 * @returns {Observable<Boolean>} - An observable indicating whether the channel window is visible.
 */
    isChannelWindowVisible(): Observable<Boolean> {
        const mobileBreakpoint = 1000; // muss analog der styles.scss $tablet-breakpoint sein
        return combineLatest([
            this.windowWidth.asObservable(),
            this.responsiveChannelWindow.asObservable()
        ]).pipe(
            map(([width, isChannelVisible]) => {
                if (width > mobileBreakpoint) {
                    return true;
                } else {
                    return isChannelVisible;
                }
            })
        );
    }
}