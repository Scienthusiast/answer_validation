/*
    Assumptions
    - an expression must contain one and only one '='
    - an expression must contain one and only one '?'
    - an expression must contains either ('+' AND '-') OR ('*' AND '/') operators 
    - all numbers are integers
    - '-' is always an operator, never a sign
    - there is no check for dividing by 0
*/
        
const getShouldInverse = function (
        sequence: string[]
    ): boolean {
        
    let currentOperator = '+';
    for (let term of sequence) {
        switch (term) {
            case '+':
            case '-':
            case '/':
            case '*':
                currentOperator = term;
                break;
            case '=':
                currentOperator = '+';
                break;
            case '?':
                return (currentOperator === '/');
        }
    }
    return false;
}

const getMultiplicativeTermSequence = function (
        sequence: string[]
    ): string[] {

    let shouldInverse = getShouldInverse(sequence);
    let isDivision = false;
    const terms = [];
        
    for (let term of sequence) {
        switch (term) {
            case '=':
                isDivision = false;
                shouldInverse = !shouldInverse;
                break;
            case '*':
                isDivision = false;
                break;
            case '/':
                isDivision = true;
                break;
            default:
                if (isNumeric(term)) {
                    terms.push(
                        ((isDivision ? 1 : 0) ^ (shouldInverse ? 1 : 0)) 
                            ?  1 / Number(term)
                            : Number(term)
                    )
                }
        }
    }
    return terms
}

const isNumeric = function (
        str: string
    ): boolean {
    return (!(isNaN(Number(str))) && (str.length > 0));
}
        
const getUnknownSign = function (
    sequence: string[]
    ): number {

    let sign = 1;
    for (let term of sequence) {
        if ((term === '=') || (term === '+')) {
            sign = 1;
        }
        if (term === '-') {
            sign = -1;
        }
        if (term === '?') {
            return (sign);
        }
    }
    return 0;
}


const getAdditiveTermSequence = function (
        sequence: string[]
    ): string[] {
        
    const terms = [];
    let signUnknown = getUnknownSign(sequence);
    let sign = 1;
    for (let term of sequence) {
        switch(term) {
            case '=':
                sign = 1;
                signUnknown = signUnknown * -1;
                break;
            case '+':
                sign = 1;
                break;
            case '-':
                sign = -1;
                break;
            default:
                if (isNumeric(term)) {
                    terms.push(parseInt(term) * sign * signUnknown);
                }
                break;
        }
    }
    return terms;
}

const isAdditiveSequence = function (
        sequence: string[]
    ): boolean {
    return (!sequence.some(elem => ['/', '*'].indexOf(elem) !== -1));
}

const isUnknownLeft = function(
        sequence: string[]
    ): boolean {
    let equalFound = false;
    for (let term of sequence) {
        if (term == "?") return !equalFound;
        if (term == "=") equalFound = true;
    }
    return false;
}

const forceUnknownToLeft = function(
        sequence: string[]
    ): string[] {
        
    if (isUnknownLeft(sequence)) return sequence;
    const left_side: string[] = [];
    const right_side: string[] = [];
    let equalFound: boolean = false;
        
    for (let term of sequence) {
        if (term === '=') equalFound = true;
        else {
            equalFound ?
                right_side.push(term)
                : left_side.push(term)
        }
    }
    return (right_side.concat(['=']).concat(left_side))
}

const orderedTermSequence = function(
    sequence: string[]
    ): string[] {

    const sequenceUnknownLeft: string[] = forceUnknownToLeft(sequence)
    const termSequence = isAdditiveSequence(sequenceUnknownLeft) ?
        getAdditiveTermSequence(sequenceUnknownLeft)
        : getMultiplicativeTermSequence(sequenceUnknownLeft)

    termSequence.sort( (a: string, b: string) => Number(a) - Number(b));
    // console.log("Sequence", sequence, 'TermSequence', termSequence);
    return (termSequence);
}

const areIdentical = function(
    sequence1: string[], 
    sequence2: string[]
    ): boolean {

    if (sequence1.length !== sequence2.length) return false;
    for (let i = 0; i < sequence1.length; i++) {
        if (sequence1[i] !== sequence2[i]) return false;
    }
    return true;
}

const containsForbiddenOperator = function(
    answer: string[],
    forbiddenOps: string[]
    ): boolean {

    return answer.some(term => forbiddenOps.indexOf(term) !== -1);
}

const isValidAnswer = function(
    answer: string[],
    target: string[], 
    forbiddenOps: string[]
    ): boolean {

    if (containsForbiddenOperator(answer, forbiddenOps)) {
        return false;
    }
    return areIdentical(
        orderedTermSequence(answer), 
        orderedTermSequence(target)
    );
}



// TESTS

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

const doTests = () => {
    testValdateAnswer();
    testForceUnknowToLeft();
    testIsUnknownLeft();
}

const testIsUnknownLeft = () => {
    console.assert (isUnknownLeft(['1', '+', '?', '=', '3']) == true, "isUnknownLeft(['1', '+', '?', '=', '3']) == true");
    console.assert (isUnknownLeft(['1', '-', '3', '=', '?']) == false, "isUnknownLeft(['1', '-', '3', '=', '?']) == false");
    console.assert (isUnknownLeft(['1', '+', '1', '=', '2']) == false, "isUnknownLeft(['1', '+', '1', '=', '2']) == false");
}

const testForceUnknowToLeft = () => {
    console.assert (arraysEqual(forceUnknownToLeft(['3', '+', '2', '=', '?']), ['?', '=', '3', '+', '2']), "forceUnknownToLeft(['3', '+', '2', '=', '?']) == ['?', '=', '3', '+', '2']");
        
    const a = ['?', '-', '2', '=', '3', '+', '2'];
    console.assert (arraysEqual(forceUnknownToLeft(a), a), "forceUnknownToLeft(a) == a");
    console.assert (arraysEqual(forceUnknownToLeft([]), ['=']), "forceUnknownToLeft([]) == ['=']");
}

const testValdateAnswer = () => {
    console.assert (isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], []) == true, "isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], []) == true");
    console.assert (isValidAnswer(['3', '+', '?', '=', '5', '4'], ['3', '+', '?', '=', '5'], []) == false, "isValidAnswer(['3', '+', '?', '=', '5', '4'], ['3', '+', '?', '=', '5'], []) == false");
    console.assert (isValidAnswer([], [], []) == true, "isValidAnswer([], [], []) == true");

    // forbidden_operators
    console.assert (isValidAnswer(['3', '*', '?', '=', '5'], ['3', '*', '?', '=', '5'], ['*']) == false, "isValidAnswer(['3', '*', '?', '=', '5'], ['3', '*', '?', '=', '5'], ['*']) == false");
    console.assert (isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], ['*', '/']) == true, "isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], ['*', '/']) == true");
    console.assert (isValidAnswer(['3', '/', '?', '=', '5'], ['3', '/', '?', '=', '5'], ['*', '/']) == false, "isValidAnswer(['3', '/', '?', '=', '5'], ['3', '/', '?', '=', '5'], ['*', '/']) == false");
        
    //  additive expressions
    console.assert (isValidAnswer(['1', '-', '?', '=', '5'], ['1', '+', '?', '=', '5'], []) == false, "isValidAnswer(['1', '-', '?', '=', '5'], ['1', '+', '?', '=', '5'], []) == false");
    console.assert (isValidAnswer(['1', '-', '?', '=', '5'], ['5', '=', '1', '-', '?'], []) == true, "isValidAnswer(['1', '-', '?', '=', '5'], ['5', '=', '1', '-', '?'], []) == true");
    console.assert (isValidAnswer(['12', '-', '4', '+', '?', '=', '4'], ['4', '=', '12', '-', '4', '+', '?'], []) == true, "isValidAnswer(['12', '-', '4', '+', '?', '=', '4'], ['4', '=', '12', '-', '4', '+', '?'], []) == true");
    console.assert (isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '44', '+', '21', '-', '1', '-', '42', '-', '12'], []) == false, "isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '44', '+', '21', '-', '1', '-', '42', '-', '12'], []) == false");
    console.assert (isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '1', '-', '44', '-', '21', '+', '42', '+', '12'], []) == true, "isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '1', '-', '44', '-', '21', '+', '42', '+', '12'], []) == true");

    console.assert (isValidAnswer(['1', '+', '2', '-', '5', '=', '?'], ['1', '-', '?', '=', '-', '2', '+', '5'], []) == true);



    //  multiplicative expressions
    console.assert (isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '5', '/', '3'], []) == true, "isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '5', '/', '3'], []) == true");
    console.assert (isValidAnswer(['3', '/', '?', '=', '5'], ['?', '=', '3', '/', '5'], []) == true, "isValidAnswer(['3', '/', '?', '=', '5'], ['?', '=', '3', '/', '5'], []) == true");
    console.assert (isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '3', '*', '5'], []) == false, "isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '3', '*', '5'], []) == false");
    console.assert (isValidAnswer(['?', '*', '3', '=', '5'], ['?', '=', '3', '*', '5'], []) == false, "isValidAnswer(['?', '*', '3', '=', '5'], ['?', '=', '3', '*', '5'], []) == false");
    console.assert (isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '5', '/', '3'], []) == true, "isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '5', '/', '3'], []) == true");
    console.assert (isValidAnswer(['5', '=', '3', '/', '?'], ['?', '=', '3', '/', '5'], []) == true, "isValidAnswer(['5', '=', '3', '/', '?'], ['?', '=', '3', '/', '5'], []) == true");
    console.assert (isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '3', '*', '5'], []) == false, "isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '3', '*', '5'], []) == false");
    console.assert (isValidAnswer(['5', '=', '?', '*', '3'], ['?', '=', '3', '*', '5'], []) == false, "isValidAnswer(['5', '=', '?', '*', '3'], ['?', '=', '3', '*', '5'], []) == false");

    console.assert (isValidAnswer(['?', '*', '4', '=', '5'], ['?', '=', '5', '/', '4'], []) == true, "isValidAnswer(['?', '*', '4', '=', '5'], ['?', '=', '5', '/', '4'], []) == true");
    console.assert (isValidAnswer(['3', '*', '2', '/', '2', '=', '?'], ['?', '/', '3', '=', '2', '/', '2'], []) == true, "isValidAnswer(['3', '*', '2', '/', '2', '=', '?'], ['?', '/', '3', '=', '2', '/', '2'], []) == true");
    console.assert (isValidAnswer(['1', '*', '3', '*', '2', '/', '2', '=', '?'], ['?', '/', '3', '=', '2', '/', '2'], []) == false, "isValidAnswer(['1', '*', '3', '*', '2', '/', '2', '=', '?'], ['?', '/', '3', '=', '2', '/', '2'], []) == false");
    console.assert (isValidAnswer(['3', '*', '2', '/', '2', '=', '?', '/', '5'], ['?', '/', '5', '/', '3', '=', '2', '/', '2'], []) == true, "isValidAnswer(['3', '*', '2', '/', '2', '=', '?', '/', '5'], ['?', '/', '5', '/', '3', '=', '2', '/', '2'], []) == true");
}

doTests();
