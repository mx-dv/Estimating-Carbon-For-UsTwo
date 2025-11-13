interface Call {
    file: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    emissions: number;
}

export function testFunc(amount:number): string  {
    return 'hello from budget!';
}

export function checkRelativeCost(tokens:number, ems:number) {


}

export function calculateRunningAverage(tokens:number, ems:number)  { //will be of type Array<number[]>
   

}