def get_should_inverse(sequence):
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
	terms = []
	for i in sequence:
		assert (i.isnumeric()) or (i in ['/', '*', '?', '='])

	should_inverse_unknown = get_should_inverse(sequence)
	should_inverse = False
	for term in sequence:
		if term in ['=', '*']:
			should_inverse = False
		elif term == '/':
			should_inverse = True
		elif term.isnumeric():
			if should_inverse ^ should_inverse_unknown:
				terms.append(1/float(term))
			else:
				terms.append(float(term))	
	print(terms)
	return terms
		
def get_unknown_sign(sequence):
	sign = 1
	for term in sequence:
		if term in ['=', '+']:
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
		if term in ['=', '+']:
			sign = 1
		elif term == '-':
			sign = -1
		elif term.isnumeric():
			terms.append(int(term) * sign * sign_unknown)
	print(terms)
	return terms

def is_additive_sequence(sequence):
	for term in sequence:
		if term in ['/', '*']:
			return False
	return True

def ordered_term_sequence(sequence):
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
	if contains_forbidden_operator(answer, forbidden_ops):
		return False
	ordered_answer = ordered_term_sequence(answer)
	ordered_target = ordered_term_sequence(target) 
	return are_identical(ordered_answer, ordered_target)

def test_validate_answer():
	assert is_valid_answer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], []) == True
	assert is_valid_answer(['3', '+', '?', '=', '5', '4'], ['3', '+', '?', '=', '5'], []) == False
	assert is_valid_answer([], [], []) == True

	#forbidden_operators
	assert is_valid_answer(['3', '*', '?', '=', '5'], ['3', '*', '?', '=', '5'], ['*']) == False
	assert is_valid_answer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], ['*', '/']) == True
	assert is_valid_answer(['3', '/', '?', '=', '5'], ['3', '/', '?', '=', '5'], ['*', '/']) == False
	assert is_valid_answer(['1', '-', '?', '=', '5'], ['1', '+', '?', '=', '5'], []) == False
	assert is_valid_answer(['1', '-', '?', '=', '5'], ['5', '=', '1', '-', '?'], []) == True
	assert is_valid_answer(['12', '-', '4', '+', '?', '=', '4'], ['4', '=', '12', '-', '4', '+', '?'], []) == True

	# *, /
	assert is_valid_answer(['3', '*', '?', '=', '5'], ['?', '=', '5', '/', '3'], []) == True
	return
	assert is_valid_answer(['3', '/', '?', '=', '5'], ['?', '=', '3', '/', '5'], []) == True

	assert is_valid_answer(['3', '*', '?', '=', '5'], ['?', '=', '3', '*', '5'], []) == False
	assert is_valid_answer(['?', '*', '3', '=', '5'], ['?', '=', '3', '*', '5'], []) == False


test_validate_answer()
