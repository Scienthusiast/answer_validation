from is_valid_answer import *

def test_all():
	test_validate_answer()
	test_force_unknown_to_left()
	test_is_unknown_left()

def test_is_unknown_left():
	assert is_unknown_left(['1', '+', '?', '=', '3']) == True
	assert is_unknown_left(['1', '-', '3', '=', '?']) == False
	#bad sequence
	assert is_unknown_left(['1', '+', '1', '=', '2']) == False

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
	
	# additive expressions
	assert is_valid_answer(['1', '-', '?', '=', '5'], ['1', '+', '?', '=', '5'], []) == False
	assert is_valid_answer(['1', '-', '?', '=', '5'], ['5', '=', '1', '-', '?'], []) == True
	assert is_valid_answer(['12', '-', '4', '+', '?', '=', '4'], ['4', '=', '12', '-', '4', '+', '?'], []) == True
	assert is_valid_answer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '44', '+', '21', '-', '1', '-', '42', '-', '12'], []) == False
	assert is_valid_answer(['42', '+', '12', '-', '?', '=', '44', '+', '21', '-', '1'], ['?', '=', '1', '-', '44', '-', '21', '+', '42', '+', '12'], []) == True

	# multiplicative expressions
	assert is_valid_answer(['3', '*', '?', '=', '5'], ['?', '=', '5', '/', '3'], []) == True
	assert is_valid_answer(['3', '/', '?', '=', '5'], ['?', '=', '3', '/', '5'], []) == True
	assert is_valid_answer(['3', '*', '?', '=', '5'], ['?', '=', '3', '*', '5'], []) == False
	assert is_valid_answer(['?', '*', '3', '=', '5'], ['?', '=', '3', '*', '5'], []) == False
	assert is_valid_answer(['5', '=', '3', '*', '?'], ['?', '=', '5', '/', '3'], []) == True
	assert is_valid_answer(['5', '=', '3', '/', '?'], ['?', '=', '3', '/', '5'], []) == True
	assert is_valid_answer(['5', '=', '3', '*', '?'], ['?', '=', '3', '*', '5'], []) == False
	assert is_valid_answer(['5', '=', '?', '*', '3'], ['?', '=', '3', '*', '5'], []) == False

	assert is_valid_answer(['?', '*', '4', '=', '5'], ['?', '=', '5', '/', '4'], []) == True
	assert is_valid_answer(['3', '*', '2', '/', '2', '=', '?'], ['?', '/', '3', '=', '2', '/', '2'], []) == True
	assert is_valid_answer(['1', '*', '3', '*', '2', '/', '2', '=', '?'], ['?', '/', '3', '=', '2', '/', '2'], []) == False
	assert is_valid_answer(['3', '*', '2', '/', '2', '=', '?', '/', '5'], ['?', '/', '5', '/', '3', '=', '2', '/', '2'], []) == True


test_all()
