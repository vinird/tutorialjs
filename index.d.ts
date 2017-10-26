/*
* Date         Version     Modified By                  Description
* 2017-10-26   0.1.0       BrainMaestro (GitHub user)   Alpha release
*/

declare namespace Tutorial {
    export let startIndex = 0;
    export let endIndex = 999;
    export let selector = '.tutorial';
    export let onlyOnce = false;
    export let styles = true;
    export let bodyScroll = false;
    export let removeAnimationConflicts = false;
    export let btnFramework = 'semantic';
    export let btnFinishText = 'Finish';
    export let btnFinishClass = 'ui button tiny basic';
    export let btnNextText = 'Next';
    export let btnNextClass = 'ui button tiny primary';

    export function start(): Promise<string>;
    export function checkBtnClass(): void;
    export function validateStart(): boolean;
    export function checkOnlyOnce(onlyOnce: boolean): boolean;
    export function initialAnimation(): void;
    export function triggerTutorialPopups(): void;
    export function checkEndIndex(): void;
    export function checkStyles(): void;
    export function createDimmer(): void;
    export function renderHtmlTutorial(count: number): string;
    export function sanitizeZindex(finish = false): void;
    export function closePopup(element: object, count: number): void;
    export function calcPopUpPosition(element: object): number;
    export function finishTutorial(element: object): void;
    export function showDimmer(): void;
    export function hideDimmer(): void;
    export function setCookie(cname: string, cvalue: string, exdays: number): void;
    export function getCookie(cname: string): string;
    export function checkCookie(cookie: string): boolean;
}