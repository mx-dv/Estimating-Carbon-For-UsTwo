# Simple calculator function
def calculator(a, b, op):
	if op == '+':
		return a + b
	elif op == '-':
		return a - b
	elif op == '*':
		return a * b
	elif op == '/':
		if b == 0:
			raise ZeroDivisionError("Cannot divide by zero")
		return a / b
	else:
		raise ValueError("Unsupported operation")

# Example usage
if __name__ == "__main__":
	print("3 + 2 =", calculator(3, 2, '+'))
	print("3 - 2 =", calculator(3, 2, '-'))
	print("3 * 2 =", calculator(3, 2, '*'))
	print("3 / 2 =", calculator(3, 2, '/'))
