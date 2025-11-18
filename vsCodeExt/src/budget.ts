import { Memento } from "vscode";

export interface Call {
    //File: string;
    //Model: string;
    //InputTokens: number;
    //OutputTokens: number;
    //TotalTokens: number;
    Emissions: number;
}

var calls: number[] = [];
var storeKey: string = "storeKey";
var callStore: Memento;

export function testFunc(amount:number): string  {
    return 'hello from budget!';
}

export async function resetBudget(): Promise<void> { 
    await callStore.update(storeKey, undefined);
}

export function initStorage(memento: Memento) {
    callStore = memento;
}

export function updateLimit(): number { // returns the median average of emissions from calls made thus far
    calls = callStore.get<number[]>(storeKey, []) || [];
    calls.sort((a, b) => a - b);
    console.log(calls);
    var mid: number = calls.length / 2;
    if (calls.length  === 0) {
        return 0;
    } 
    else if (calls.length % 2 === 0) {
        return (calls[(mid)] + calls[mid -1]) / 2;
    }
    else {
        return calls[Math.floor(mid)];
    }
}

export function storeCall(newCall: Call): void {
    calls = callStore.get<number[]>(storeKey, []) || [];
    calls.push(newCall.Emissions);
    callStore.update(storeKey, calls);
}



