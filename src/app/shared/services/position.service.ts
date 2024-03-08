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

@Injectable({
    providedIn: 'root'
})

export class PositionService {
    private menuOpen = new BehaviorSubject<boolean>(true); // Standardmäßig ist das Menü geöffnet
    private responsiveActiveWindow = new BehaviorSubject<"menu" | "channel">("menu");
    private responsiveThreadWindow = new BehaviorSubject<Boolean>(false);
    private responsiveChannelWindow = new BehaviorSubject<Boolean>(true);
    private windowWidth = new BehaviorSubject<number>(0); // Initialwert auf 0

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


    getDialogPos(element: ElementRef | undefined): DialogPosition | undefined {
        if (!element) return undefined
        const windowH = window.innerHeight;
        let pos: ElementPos;
        let e: any = element;
        pos = this.getElementPos(e._elementRef.nativeElement)
        return { bottom: windowH - pos.y + 'px', left: pos.x + 'px' }
    }

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

    getDialogPosWithCorner(element: ElementRef | undefined, cornerPos: 'right' | 'left' | 'bottom-right' |  'bottom-left', xOffset?: number): DialogPosition | undefined {
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

    getElementPos(element: any): ElementPos {
        return {
            y: element.getBoundingClientRect().y,
            h: element.getBoundingClientRect().height,
            x: element.getBoundingClientRect().x,
            w: element.getBoundingClientRect().width,
        }
    }

    toggleMenu() {
        this.menuOpen.next(!this.menuOpen.value);
    }

    isMenuOpen(): Observable<boolean> {
        return this.menuOpen.asObservable();
    }

    setActiveResponsiveWindow(value: "menu" | "channel") {
        this.responsiveActiveWindow.next(value);
    }

    getActiveResponsiveWindow(): Observable<string> {
        return this.responsiveActiveWindow.asObservable();
    }

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

    // das Ganze auch für die Threads

    setThreadResponsiveWindow(value: Boolean) {
        this.responsiveThreadWindow.next(value);
        this.responsiveChannelWindow.next(!value);
    }

    getThreadResponsiveWindow(): Observable<Boolean> {
        return this.responsiveThreadWindow.asObservable();
    }

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

    // und auch explizit für den Channel/Msg Part innerhalb der großen CHannel-Komponente

    setChannelResponsiveWindow(value: Boolean) {
        this.responsiveChannelWindow.next(value);
    }

    getChannelResponsiveWindow(): Observable<Boolean> {
        return this.responsiveChannelWindow.asObservable();
    }

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