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

def is_additive_sequence(sequence):
	for term in sequence:
		if term in ['/', '*']:
			return False
	return True

def ordered_term_sequence(sequence):
	sequence = force_unknown_to_left(sequence)
	if is_additive_sequence(sequence):
		term_sequence = get_additive_term_sequence(sequence)
	else:
		term_sequence = get_multiplicative_term_sequence(sequence)
	term_sequence.sort()
	return term_sequence

def are_identical(sequence1, sequence2):
	if (len(sequence1) != len(sequence2)):
		return False
	for i in range(len(sequence1)):
		if (sequence1[i] != sequence2[i]):
			return False
	return True	

def contains_forbidden_operator(answer, forbidden_ops):
	for elem in answer:
		if elem in forbidden_ops:
			return True
	return False 

def is_valid_answer(answer, target, forbidden_ops):
	for i in answer:
		assert (i.isnumeric()) or (i in ['/', '*', '?', '=', '+', '-'])

	if contains_forbidden_operator(answer, forbidden_ops):
		return False
	ordered_answer = ordered_term_sequence(answer)
	ordered_target = ordered_term_sequence(target) 
	return are_identical(ordered_answer, ordered_target)
