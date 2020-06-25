
def is_unknown_left(sequence):
	equal_found = False
	for term in sequence:
		if term == "?":
			return not equal_found
		if term == "=":
			equal_found = True
	#no unknown => invalid sequence, error
	return False 

def term_sequence(sequence):
	terms = []
	unknown_left = is_unknown_left(sequence)
	equal_found_sign = -1
	sign = 1
	sign_unknown = 1
	for term in sequence:
		if term == "=":
			sign = 1
			equal_found_sign = 1
		elif term == "-":
			sign = -1
		elif term == "+":
			sign = 1
		elif term == "?":
			sign_unknown = sign
		elif term.isnumeric:
			terms.append(sign * equal_found_sign * int(term) * sign_unknown)
#this is programming by coincidence for the moment... if it works I don't really know why / how
	
	# PROBLEME avec "-?"
			# sign
	
	print(terms)
	return terms

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
	ordered_answer = term_sequence(answer)
	ordered_target = term_sequence(target) 
	return are_identical(ordered_answer, ordered_target)

def test_validate_answer():
	assert is_valid_answer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], []) == True
	assert is_valid_answer(['3', '+', '?', '=', '5', '4'], ['3', '+', '?', '=', '5'], []) == False
	assert is_valid_answer([], [], []) == True

	#forbidden_operators
	assert is_valid_answer(['3', '*', '?', '=', '5'], ['3', '*', '?', '=', '5'], ['*']) == False
	assert is_valid_answer(['3', '+', '?', '=', '5'], ['3', '+', '?', '=', '5'], ['*', '/']) == True
	assert is_valid_answer(['3', '/', '?', '=', '5'], ['3', '/', '?', '=', '5'], ['*', '/']) == False

	#
	assert is_valid_answer(['1', '-', '?', '=', '5'], ['1', '+', '?', '=', '5'], []) == False

	assert is_valid_answer(['12', '-', '4', '+', '?', '=', '4'], ['4', '=', '12', '-', '4', '+', '?'], []) == True

test_validate_answer()
