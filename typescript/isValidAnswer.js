/*
    Assumptions
    - an expression must contain one and only one '='
    - an expression must contain one and only one '?'
    - an expression must contains either ('+' AND '-') OR ('*' AND ':') operators
    - all numbers are integers
    - '-' is always an operator, never a sign
    - there is no check for dividing by 0
*/
var OPERATORS = {
    ADD: '+',
    SUB: '-',
    DIV: ':',
    MUL: '*'
};
var getShouldInverse = function (sequence) {
    var currentOperator = OPERATORS.ADD;
    for (var _i = 0, sequence_1 = sequence; _i < sequence_1.length; _i++) {
        var term = sequence_1[_i];
        switch (term) {
            case '=':
                currentOperator = OPERATORS.ADD;
                break;
            case '?':
                return (currentOperator === OPERATORS.DIV);
            default:
                if (isOperator(term)) {
                    currentOperator = term;
                }
        }
    }
    return false;
};
var getMultiplicativeTermSequence = function (sequence) {
    var shouldInverse = getShouldInverse(sequence);
    var isDivision = false;
    var terms = [];
    for (var _i = 0, sequence_2 = sequence; _i < sequence_2.length; _i++) {
        var term = sequence_2[_i];
        switch (term) {
            case '=':
                isDivision = false;
                shouldInverse = !shouldInverse;
                break;
            case OPERATORS.MUL:
                isDivision = false;
                break;
            case OPERATORS.DIV:
                isDivision = true;
                break;
            default:
                if (isNumeric(term)) {
                    terms.push(((isDivision ? 1 : 0) ^ (shouldInverse ? 1 : 0))
                        ? Number(term)
                        : 1 / Number(term));
                }
        }
    }
    return terms;
};
var isNumeric = function (str) {
    return (!(isNaN(Number(str))) && (str.length > 0));
};
var getUnknownSign = function (sequence) {
    var sign = 1;
    for (var _i = 0, sequence_3 = sequence; _i < sequence_3.length; _i++) {
        var term = sequence_3[_i];
        if ((term === '=') || (term === OPERATORS.ADD)) {
            sign = 1;
        }
        if (term === OPERATORS.SUB) {
            sign = -1;
        }
        if (term === '?') {
            return (sign);
        }
    }
    return 0;
};
var getAdditiveTermSequence = function (sequence) {
    var terms = [];
    var signUnknown = getUnknownSign(sequence);
    var sign = 1;
    for (var _i = 0, sequence_4 = sequence; _i < sequence_4.length; _i++) {
        var term = sequence_4[_i];
        switch (term) {
            case '=':
                sign = 1;
                signUnknown = signUnknown * -1;
                break;
            case OPERATORS.ADD:
                sign = 1;
                break;
            case OPERATORS.SUB:
                sign = -1;
                break;
            default:
                if (isNumeric(term)) {
                    terms.push(parseInt(term) * sign * signUnknown * -1);
                }
                break;
        }
    }
    return terms;
};
var isAdditiveSequence = function (sequence) {
    return (!sequence.some(function (elem) { return [OPERATORS.DIV, OPERATORS.MUL].indexOf(elem) !== -1; }));
};
var isUnknownLeft = function (sequence) {
    var equalFound = false;
    for (var _i = 0, sequence_5 = sequence; _i < sequence_5.length; _i++) {
        var term = sequence_5[_i];
        if (term == "?")
            return !equalFound;
        if (term == "=")
            equalFound = true;
    }
    return false;
};
var forceUnknownToLeft = function (sequence) {
    if (isUnknownLeft(sequence))
        return sequence;
    var left_side = [];
    var right_side = [];
    var equalFound = false;
    for (var _i = 0, sequence_6 = sequence; _i < sequence_6.length; _i++) {
        var term = sequence_6[_i];
        if (term === '=')
            equalFound = true;
        else {
            equalFound ?
                right_side.push(term)
                : left_side.push(term);
        }
    }
    return (right_side.concat(['=']).concat(left_side));
};
var orderedTermSequence = function (sequence) {
    var sequenceUnknownLeft = forceUnknownToLeft(sequence);
    var termSequence = isAdditiveSequence(sequenceUnknownLeft) ?
        getAdditiveTermSequence(sequenceUnknownLeft)
        : getMultiplicativeTermSequence(sequenceUnknownLeft);
    termSequence.sort(function (a, b) { return Number(a) - Number(b); });
    return (termSequence);
};
var areIdentical = function (sequence1, sequence2) {
    if (sequence1.length !== sequence2.length)
        return false;
    for (var i = 0; i < sequence1.length; i++) {
        if (sequence1[i] !== sequence2[i])
            return false;
    }
    return true;
};
var containsForbiddenOperator = function (answer, forbiddenOps) {
    return answer.some(function (term) { return forbiddenOps.indexOf(term) !== -1; });
};
var isOperator = function (str) {
    return [OPERATORS.ADD, OPERATORS.SUB, OPERATORS.MUL, OPERATORS.DIV].indexOf(str) !== -1;
};
var isInvalidExpression = function (answer) {
    var shouldBeOperand = true;
    for (var _i = 0, answer_1 = answer; _i < answer_1.length; _i++) {
        var term = answer_1[_i];
        if (isOperator(term)) {
            if (shouldBeOperand)
                return false;
        }
    }
    return true;
};
var isValidAnswer = function (answer, target, forbiddenOps) {
    if (isInvalidExpression(answer)
        || containsForbiddenOperator(answer, forbiddenOps)) {
        return false;
    }
    return areIdentical(orderedTermSequence(answer), orderedTermSequence(target));
};
// TESTS
function arraysEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (a.length !== b.length)
        return false;
    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i])
            return false;
    }
    return true;
}
var doTests = function () {
    testValdateAnswer();
    testForceUnknowToLeft();
    testIsUnknownLeft();
};
var testIsUnknownLeft = function () {
    console.assert(isUnknownLeft(['1', '+', '?', '=', '3']) == true, "isUnknownLeft(['1', '+', '?', '=', '3']) == true");
    console.assert(isUnknownLeft(['1', '-', '3', '=', '?']) == false, "isUnknownLeft(['1', '-', '3', '=', '?']) == false");
    console.assert(isUnknownLeft(['1', '+', '1', '=', '2']) == false, "isUnknownLeft(['1', '+', '1', '=', '2']) == false");
};
var testForceUnknowToLeft = function () {
    console.assert(arraysEqual(forceUnknownToLeft(['3', '+', '2', '=', '?']), ['?', '=', '3', '+', '2']), "forceUnknownToLeft(['3', '+', '2', '=', '?']) == ['?', '=', '3', '+', '2']");
    var a = ['?', '-', '2', '=', '3', '+', '2'];
    console.assert(arraysEqual(forceUnknownToLeft(a), a), "forceUnknownToLeft(a) == a");
    console.assert(arraysEqual(forceUnknownToLeft([]), ['=']), "forceUnknownToLeft([]) == ['=']");
};
var testValdateAnswer = function () {
    console.assert(isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], []) == true, "isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], []) == true");
    console.assert(isValidAnswer(['3', '+', '?', '=', '5', '4'], ['3', '+', '?', '=', '5'], []) == false, "isValidAnswer(['3', '+', '?', '=', '5', '4'], ['3', '+', '?', '=', '5'], []) == false");
    // forbidden_operators
    console.assert(isValidAnswer(['3', '*', '?', '=', '5'], ['3', '*', '?', '=', '5'], ['*']) == false, "isValidAnswer(['3', '*', '?', '=', '5'], ['3', '*', '?', '=', '5'], ['*']) == false");
    console.assert(isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], ['*', ':']) == true, "isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], ['*', ':']) == true");
    console.assert(isValidAnswer(['3', ':', '?', '=', '5'], ['3', ':', '?', '=', '5'], ['*', ':']) == false, "isValidAnswer(['3', ':', '?', '=', '5'], ['3', ':', '?', '=', '5'], ['*', ':']) == false");
    //  additive expressions
    console.assert(isValidAnswer(['1', '-', '?', '=', '5'], ['1', '+', '?', '=', '5'], []) == false, "isValidAnswer(['1', '-', '?', '=', '5'], ['1', '+', '?', '=', '5'], []) == false");
    console.assert(isValidAnswer(['1', '-', '?', '=', '5'], ['5', '=', '1', '-', '?'], []) == true, "isValidAnswer(['1', '-', '?', '=', '5'], ['5', '=', '1', '-', '?'], []) == true");
    console.assert(isValidAnswer(['12', '-', '4', '+', '?', '=', '4'], ['4', '=', '12', '-', '4', '+', '?'], []) == true, "isValidAnswer(['12', '-', '4', '+', '?', '=', '4'], ['4', '=', '12', '-', '4', '+', '?'], []) == true");
    console.assert(isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '44', '+', '21', '-', '1', '-', '42', '-', '12'], []) == false, "isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '44', '+', '21', '-', '1', '-', '42', '-', '12'], []) == false");
    console.assert(isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '1', '-', '44', '-', '21', '+', '42', '+', '12'], []) == true, "isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '1', '-', '44', '-', '21', '+', '42', '+', '12'], []) == true");
    //  multiplicative expressions
    console.assert(isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '5', ':', '3'], []) == true, "isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '5', ':', '3'], []) == true");
    console.assert(isValidAnswer(['3', ':', '?', '=', '5'], ['?', '=', '3', ':', '5'], []) == true, "isValidAnswer(['3', ':', '?', '=', '5'], ['?', '=', '3', ':', '5'], []) == true");
    console.assert(isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '3', '*', '5'], []) == false, "isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '3', '*', '5'], []) == false");
    console.assert(isValidAnswer(['?', '*', '3', '=', '5'], ['?', '=', '3', '*', '5'], []) == false, "isValidAnswer(['?', '*', '3', '=', '5'], ['?', '=', '3', '*', '5'], []) == false");
    console.assert(isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '5', ':', '3'], []) == true, "isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '5', ':', '3'], []) == true");
    console.assert(isValidAnswer(['5', '=', '3', ':', '?'], ['?', '=', '3', ':', '5'], []) == true, "isValidAnswer(['5', '=', '3', ':', '?'], ['?', '=', '3', ':', '5'], []) == true");
    console.assert(isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '3', '*', '5'], []) == false, "isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '3', '*', '5'], []) == false");
    console.assert(isValidAnswer(['5', '=', '?', '*', '3'], ['?', '=', '3', '*', '5'], []) == false, "isValidAnswer(['5', '=', '?', '*', '3'], ['?', '=', '3', '*', '5'], []) == false");
    console.assert(isValidAnswer(['?', '*', '4', '=', '5'], ['?', '=', '5', ':', '4'], []) == true, "isValidAnswer(['?', '*', '4', '=', '5'], ['?', '=', '5', ':', '4'], []) == true");
    console.assert(isValidAnswer(['3', '*', '2', ':', '2', '=', '?'], ['?', ':', '3', '=', '2', ':', '2'], []) == true, "isValidAnswer(['3', '*', '2', ':', '2', '=', '?'], ['?', ':', '3', '=', '2', ':', '2'], []) == true");
    console.assert(isValidAnswer(['1', '*', '3', '*', '2', ':', '2', '=', '?'], ['?', ':', '3', '=', '2', ':', '2'], []) == false, "isValidAnswer(['1', '*', '3', '*', '2', ':', '2', '=', '?'], ['?', ':', '3', '=', '2', ':', '2'], []) == false");
    console.assert(isValidAnswer(['3', '*', '2', ':', '2', '=', '?', ':', '5'], ['?', ':', '5', ':', '3', '=', '2', ':', '2'], []) == true, "isValidAnswer(['3', '*', '2', ':', '2', '=', '?', ':', '5'], ['?', ':', '5', ':', '3', '=', '2', ':', '2'], []) == true");
    // incorrect expressions
    console.assert(isValidAnswer([], [], []) == false, "isValidAnswer([], [], []) == false");
    console.assert(isValidAnswer(['='], ['1', '=', '1'], []) == false);
    console.assert(isValidAnswer(['3', '2', '=', '?'], ['3', '+', '2', '=', '?'], []) == false, "['3', '2', '=', '?'], ['3', '+', '2', '=', '?'], []) == false");
    console.assert(isValidAnswer(['3', '+', '2', '=', '?'], ['3', '-', '-', '2', '=', '?'], []) == false, "['3', '+', '2', '=', '?'], ['3', '-', '-', '2', '=', '?'], []) == false");
    console.assert(isValidAnswer(['3', '+', '2', '=', '?'], ['3', '-', '2', '-', '=', '?'], []) == false, "['3', '+', '2', '=', '?'], ['3', '-', '2', '-', '=', '?'], []) == false");
    // - not as operator, but as sign
    console.assert(isValidAnswer(['1', '+', '2', '-', '5', '=', '?'], ['1', '-', '?', '=', '-', '2', '+', '5'], []) == true, "['1', '+', '2', '-', '5', '=', '?'], ['1', '-', '?', '=', '-', '2', '+', '5'], []) == true");
};
doTests();
