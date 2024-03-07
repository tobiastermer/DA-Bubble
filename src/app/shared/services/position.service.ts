import { ElementRef, Injectable } from "@angular/core";
import { DialogPosition } from "@angular/material/dialog";
import { BehaviorSubject, fromEvent, Observable, combineLatest, of } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';

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
    private responsiveActiveWindow = new BehaviorSubject<"menu" | "channel" | "thread" | "message" | "new">("menu");
    private windowWidth = new BehaviorSubject<number>(window.innerWidth);

    constructor() {
        // Fenster-Resize-Event abonnieren und die Fensterbreite aktualisieren
        fromEvent(window, 'resize')
            .pipe(
                debounceTime(100), // Verzögerung, um Performance-Probleme zu vermeiden
                map(() => window.innerWidth),
                startWith(window.innerWidth) // Startwert setzen
            )
            .subscribe(width => this.windowWidth.next(width));
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

    getDialogPosWithCorner(element: ElementRef | undefined, cornerPos: 'right' | 'left' | 'bottom'): DialogPosition | undefined {
        if (!element) return undefined
        const windowH = window.innerHeight;
        const windowW = window.innerWidth;
        let pos: ElementPos;
        if (element.nativeElement) pos = this.getElementPos(element.nativeElement);
        else {
            let e: any = element;
            pos = this.getElementPos(e._elementRef.nativeElement)
        }
        if (cornerPos === 'right') return { top: pos.y + pos.h + 'px', right: windowW - pos.x - pos.w + 'px' }
        else if (cornerPos === 'bottom') return { bottom: windowH - pos.y + 'px', right: windowW - pos.x - pos.w + 'px' }
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

    setActiveResponsiveWindow(value: "menu" | "channel" | "thread" | "message" | "new") {
        this.responsiveActiveWindow.next(value);
    }

    getActiveResponsiveWindow(): Observable<string> {
        return this.responsiveActiveWindow.asObservable();
    }

    isResponsiveWindowVisible(value: "menu" | "channel" | "thread" | "message" | "new"): Observable<boolean> {
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

}