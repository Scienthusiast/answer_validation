def force_unknown_to_left(sequence):
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
	equal_found = False
	for term in sequence:
		if term == "?":
			return not equal_found
		if term == "=":
			equal_found = True
	#no unknown => invalid sequence, should be error
	return False 

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
#test 
	for i in sequence:
		assert (i.isnumeric()) or (i in ['/', '*', '?', '='])

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
				#if term = 0, all is despair and loss 
				terms.append(1/float(term))
			else:
				terms.append(float(term))	
	print(terms)
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
	print(terms)
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
	if contains_forbidden_operator(answer, forbidden_ops):
		return False
	ordered_answer = ordered_term_sequence(answer)
	ordered_target = ordered_term_sequence(target) 
	return are_identical(ordered_answer, ordered_target)



def test_all():
	test_validate_answer()
	test_force_unknown_to_left()

def test_force_unknown_to_left():
	assert force_unknown_to_left(['3', '+', '2', '=', '?']) == ['?', '=', '3', '+', '2']
	a = ['?', '-', '2', '=', '3', '+', '2']
	assert force_unknown_to_left(a) == a

	#bad sequences (shouldn't happen)
	assert force_unknown_to_left([]) == ['=']

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
	assert is_valid_answer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '44', '+', '21', '-', '1', '-', '42', '-', '12'], []) == False
	assert is_valid_answer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '1', '-', '44', '-', '21', '+', '42', '+', '12'], []) == True

	# *, /
	assert is_valid_answer(['3', '*', '?', '=', '5'], ['?', '=', '5', '/', '3'], []) == True
	assert is_valid_answer(['3', '/', '?', '=', '5'], ['?', '=', '3', '/', '5'], []) == True
	assert is_valid_answer(['3', '*', '?', '=', '5'], ['?', '=', '3', '*', '5'], []) == False
	assert is_valid_answer(['?', '*', '3', '=', '5'], ['?', '=', '3', '*', '5'], []) == False
	assert is_valid_answer(['5', '=', '3', '*', '?'], ['?', '=', '5', '/', '3'], []) == True
	assert is_valid_answer(['5', '=', '3', '/', '?'], ['?', '=', '3', '/', '5'], []) == True
	assert is_valid_answer(['5', '=', '3', '*', '?'], ['?', '=', '3', '*', '5'], []) == False
	assert is_valid_answer(['5', '=', '?', '*', '3'], ['?', '=', '3', '*', '5'], []) == False

	assert is_valid_answer(['?', '*', '4', '=', '5'], ['?', '=', '5', '/', '4'], []) == True



test_all()
