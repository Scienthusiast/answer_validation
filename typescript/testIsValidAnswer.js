var ansVal = require('./isValidAnswer');
var testAll = function () {
    test_validate_answer();
    // test_force_unknown_to_left();
    // test_is_unknown_left();
};
// const test_is_unknown_left = () => {
// 	console.assert (is_unknown_left(['1', '+', '?', '=', '3']) == true);
// 	console.assert (is_unknown_left(['1', '-', '3', '=', '?']) == false);
//     console.assert (is_unknown_left(['1', '+', '1', '=', '2']) == false);
// }
// const test_force_unknown_to_left = () => {
// 	console.assert (force_unknown_to_left(['3', '+', '2', '=', '?']) == ['?', '=', '3', '+', '2']);
//     a = ['?', '-', '2', '=', '3', '+', '2']
// 	console.assert (force_unknown_to_left(a) == a);
//     console.assert (force_unknown_to_left([]) == ['=']);
// }
var test_validate_answer = function () {
    console.assert(ansVal.isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], []) == true);
    console.assert(ansVal.isValidAnswer(['3', '+', '?', '=', '5', '4'], ['3', '+', '?', '=', '5'], []) == false);
    console.assert(ansVal.isValidAnswer([], [], []) == true);
    // forbidden_operators
    console.assert(ansVal.isValidAnswer(['3', '*', '?', '=', '5'], ['3', '*', '?', '=', '5'], ['*']) == false);
    console.assert(ansVal.isValidAnswer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], ['*', '/']) == true);
    console.assert(ansVal.isValidAnswer(['3', '/', '?', '=', '5'], ['3', '/', '?', '=', '5'], ['*', '/']) == false);
    //  additive expressions
    console.assert(ansVal.isValidAnswer(['1', '-', '?', '=', '5'], ['1', '+', '?', '=', '5'], []) == false);
    console.assert(ansVal.isValidAnswer(['1', '-', '?', '=', '5'], ['5', '=', '1', '-', '?'], []) == true);
    console.assert(ansVal.isValidAnswer(['12', '-', '4', '+', '?', '=', '4'], ['4', '=', '12', '-', '4', '+', '?'], []) == true);
    console.assert(ansVal.isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '44', '+', '21', '-', '1', '-', '42', '-', '12'], []) == false);
    console.assert(ansVal.isValidAnswer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '1', '-', '44', '-', '21', '+', '42', '+', '12'], []) == true);
    //  multiplicative expressions
    console.assert(ansVal.isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '5', '/', '3'], []) == true);
    console.assert(ansVal.isValidAnswer(['3', '/', '?', '=', '5'], ['?', '=', '3', '/', '5'], []) == true);
    console.assert(ansVal.isValidAnswer(['3', '*', '?', '=', '5'], ['?', '=', '3', '*', '5'], []) == false);
    console.assert(ansVal.isValidAnswer(['?', '*', '3', '=', '5'], ['?', '=', '3', '*', '5'], []) == false);
    console.assert(ansVal.isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '5', '/', '3'], []) == true);
    console.assert(ansVal.isValidAnswer(['5', '=', '3', '/', '?'], ['?', '=', '3', '/', '5'], []) == true);
    console.assert(ansVal.isValidAnswer(['5', '=', '3', '*', '?'], ['?', '=', '3', '*', '5'], []) == false);
    console.assert(ansVal.isValidAnswer(['5', '=', '?', '*', '3'], ['?', '=', '3', '*', '5'], []) == false);
    console.assert(ansVal.isValidAnswer(['?', '*', '4', '=', '5'], ['?', '=', '5', '/', '4'], []) == true);
    console.assert(ansVal.isValidAnswer(['3', '*', '2', '/', '2', '=', '?'], ['?', '/', '3', '=', '2', '/', '2'], []) == true);
    console.assert(ansVal.isValidAnswer(['1', '*', '3', '*', '2', '/', '2', '=', '?'], ['?', '/', '3', '=', '2', '/', '2'], []) == false);
    console.assert(ansVal.isValidAnswer(['3', '*', '2', '/', '2', '=', '?', '/', '5'], ['?', '/', '5', '/', '3', '=', '2', '/', '2'], []) == true);
};
testAll();
