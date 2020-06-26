/*

'''
	Assumptions
	- an expression must contain one and only one '='
	- an expression must contain one and only one '?'
	- an expression must contains either ('+' AND '-') OR ('*' AND '/') operators 
	- all numbers are integers
	- '-' is always an operator, never a sign
	- there is no check for dividing by 0
'''

def force_unknown_to_left(sequence):
	'''
		Switch the block containing the ? on the left side
	'''
	if is_unknown_left(sequence): 
		return sequence
	else:
		left_side = []
		right_side = []
		equal_found = False
		for i in sequence:
			if i == '=':
				equal_found = True
			else:
				if equal_found:
					right_side.append(i)
				else:
					left_side.append(i)
	return right_side + ['='] + left_side

def is_unknown_left(sequence):
	'''
		Checks if the '?' is on the left side of the '='
	'''
	equal_found = False
	for term in sequence:
		if term == "?":
			return not equal_found
		if term == "=":
			equal_found = True
	return False 

def get_should_inverse(sequence):
	'''
		Returns true if the unknown value is a denominator
	'''
	current_operator = '+'
	for term in sequence:
		if term in ['+', '-', '/', '*']:
			current_operator = term
		elif term == '=':
			current_operator = '+'
		elif term == '?':
			return current_operator == '/'
	return False

def get_multiplicative_term_sequence(sequence):

	#unknown_left = is_unknown_left(sequence)
	#should rather force the unknown to the left

	should_inverse = get_should_inverse(sequence)
	is_div = False

	terms = []
	should_inverse_unknown = get_should_inverse(sequence)

	for term in sequence:
		if term in ['=']:
			is_div = False
			should_inverse = not should_inverse
		elif term == '*':
			is_div = False
		elif term == '/':
			is_div = True
		elif term.isnumeric():
			if is_div ^ should_inverse:
				# Division by 0. How to signal error?
				if term == 0:
					return []
				terms.append(1/float(term))
			else:
				terms.append(float(term))	
	return terms
		
def get_unknown_sign(sequence):
	sign = 1
	for term in sequence:
		if term == ['=', '+']:
			sign = 1
		elif term == '-':
			sign = -1
		if term == '?':
			return sign
	return 0

def get_additive_term_sequence(sequence):
	terms = []
	sign_unknown = get_unknown_sign(sequence)
	sign = 1
	for term in sequence:
		if term == '=':
			sign = 1
			sign_unknown = -1 * sign_unknown
		elif term == '+':
			sign = 1
		elif term == '-':
			sign = -1
		elif term.isnumeric():
			terms.append(int(term) * sign * sign_unknown)
	return terms

*/
// get_multiplicative_term_sequence
const get_additive_term_sequence = function (
        sequence: string[]
    ): string[] {
    
    const terms = [];
    let sign_unknown = get_unknown_sign(sequence);
    let sign = 1;

    for (let term of sequence) {
        switch(term) {
            case '=':
                sign = 1;
                sign_unknown = sign_unknown * -1;
                break;
            case '+':
                sign = 1;
                break;
            case '-':
                sign = -1;
                break;
            default:
                if (!(isNaN(Number(term))) && (term.length > 0)) {
                    terms.push(parseInt(term) * sign * sign_unknown);
                }
                break;
        }
    }
    return terms;
}

const is_additive_sequence = function (
        sequence: string[]
    ): boolean {
    return (!sequence.some(elem => ['/', '*'].includes(elem)));
}

const is_unknown_left = function(
        sequence: string[]
    ): boolean {
    let equal_found = false;
    for (let term of sequence) {
        if (term == "?") return !equal_found;
        if (term == "=") equal_found = true;
    }
    return false;
}

const force_unknown_to_left = function(
        sequence: string[]
    ): string[] {
    
    if (is_unknown_left(sequence)) return sequence;
    const left_side: string[] = [];
    const right_side: string[] = [];
    let equal_found: boolean = false;
    
    for (let term of sequence) {
        if (term === '=') equal_found = true;
        else {
            equal_found ?
                right_side.push(term)
                : left_side.push(term)
        }
    }
    return (right_side.concat(['=']).concat(left_side))
}

const ordered_term_sequence = function(
    sequence: string[]
    ): string[] {

    const sequence_unknown_left: string[] = force_unknown_to_left(sequence)
    const term_sequence = is_additive_sequence(sequence_unknown_left) ?
        get_additive_term_sequence(sequence_unknown_left)
        : get_multiplicative_term_sequence(sequence_unknown_left)

    return (term_sequence.sort());
}

const are_identical = function(
    sequence1: string[], 
    sequence2: string[]
    ): boolean {

    if (sequence1.length !== sequence2.length) return false;
    for (let i = 0; i < sequence1.length; i++) {
        if (sequence1[i] !== sequence2[i]) return false;
    }
    return true;
}

const contains_forbidden_operator = function(
    answer: string[],
    forbidden_ops: string[]
    ): boolean {

    return answer.some(term => forbidden_ops.includes(term));
}

const is_valid_answer = function(
    answer: string[],
    target: string[], 
    forbidden_ops: string[]
    ): boolean {

    if (contains_forbidden_operator(answer, forbidden_ops)) {
        return false;
    }
    return are_identical(
        ordered_term_sequence(answer), 
        ordered_term_sequence(target)
    );
}