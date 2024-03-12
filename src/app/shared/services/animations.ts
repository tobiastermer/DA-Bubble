import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * Defines a slide animation trigger that can be attached to an Angular component or element.
 * This animation supports 'in' and 'out' states for entering and leaving transitions.
 */
//Animation Slide in und out zur anwendung auf eine klasse .
// auf die klasse muss eine [@slideAnimation]="animationState" gestzt werden .
// triggern mit animationState ( 'in' oder 'out' ) beispiel in der sign_up.
export const slideAnimation = trigger('slideAnimation', [
  state('in', style({ transform: 'translateY(0)', opacity: 1 })),
  transition('void => in', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('0.5s ease-out')
  ]),
  state('out', style({ transform: 'translateY(100%)', opacity: 0 })),
  transition('in => out', [
    style({ transform: 'translateY(0)', opacity: 1 }),
    animate('0.5s ease-out')
  ])
]);

/**
 * Slide-in animation from the bottom of the screen.
 */
// einzel animations. einbinden unter animations[slideInUpAnimation] und dann auf die
// klasse auf die es angewendet werden soll @slideInUp anheften .
// Besipiel login
export const slideInUpAnimation = trigger('slideInUp', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
]);

/**
 * Slow slide-in animation from the bottom of the screen.
 */
export const slideInUpAnimationSlow = trigger('slideInUpSlow', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate('0.75s ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
]);

/**
 * Slow slide-in animation from the right side of the screen.
 */
export const slideInleftAnimationSlow = trigger('slideInLeftSlow', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('0.75s ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
]);

/**
 * Slow slide-in animation from the left side of the screen.
 */
export const slideInRightAnimationSlow = trigger('slideInRightSlow', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)', opacity: 0 }),
    animate('0.75s ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
]);

/**
 * Slide-out animation towards the bottom of the screen.
 */
export const slideOutDownAnimation = trigger('slideOutDown', [
  transition(':leave', [
    style({ transform: 'translateY(0)', opacity: 1 }),
    animate('0.8s ease', style({ transform: 'translateY(100%)', opacity: 0 })),
  ]),
]);

/**
* Error animation for displaying error messages with a slide-in effect.
*/
export const errorAnimation = trigger('errorAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(100%)', opacity: 0 }),
    animate(
      '0.5s ease-out',
      style({ transform: 'translateY(0)', opacity: 1 })
    ),
  ]),
]);