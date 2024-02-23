import { ElementRef, Injectable } from "@angular/core";
import { DialogPosition } from "@angular/material/dialog";

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

    getDialogPosWithCorner(element: ElementRef | undefined, cornerPos: 'right' | 'left'): DialogPosition | undefined {
        if (!element) return undefined
        const windowW = window.innerWidth;
        let pos: ElementPos;
        if (element.nativeElement) pos = this.getElementPos(element.nativeElement);
        else {
            let e: any = element;
            pos = this.getElementPos(e._elementRef.nativeElement)
        }
        if (cornerPos === 'right') return { top: pos.y + pos.h + 'px', right: windowW - pos.x - pos.w + 'px' }
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

}