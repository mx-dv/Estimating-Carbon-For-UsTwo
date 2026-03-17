import math


class Calculator:
    """An enhanced calculator class with history tracking and extended operations."""
    
    def __init__(self):
        """Initialize the calculator with an empty history."""
        self.history = []
        self.OPERATIONS = {
            '+': lambda a, b: a + b,
            '-': lambda a, b: a - b,
            '*': lambda a, b: a * b,
            '/': self._divide,
            '%': self._modulo,
            '**': lambda a, b: a ** b,
            'pow': lambda a, b: a ** b,
            'sqrt': lambda a, _: math.sqrt(a) if a >= 0 else self._error(f"Cannot take square root of {a}"),
            'log': lambda a, _: math.log(a) if a > 0 else self._error(f"Cannot take log of {a}"),
            'log10': lambda a, _: math.log10(a) if a > 0 else self._error(f"Cannot take log10 of {a}"),
            'abs': lambda a, _: abs(a),
            'sin': lambda a, _: math.sin(a),
            'cos': lambda a, _: math.cos(a),
            'tan': lambda a, _: math.tan(a),
            'max': lambda a, b: max(a, b),
            'min': lambda a, b: min(a, b),
        }
    
    @staticmethod
    def _error(message):
        """Helper method to raise an error."""
        raise ValueError(message)
    
    @staticmethod
    def _divide(a, b):
        """Perform division with zero-check."""
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        return a / b
    
    @staticmethod
    def _modulo(a, b):
        """Perform modulo operation with zero-check."""
        if b == 0:
            raise ZeroDivisionError("Cannot perform modulo with zero")
        return a % b
    
    def calculate(self, a, b, operation):
        """
        Perform a calculation with the given operation.
        
        Args:
            a (float): First operand
            b (float): Second operand (unused for unary operations)
            operation (str): Operation to perform
        
        Returns:
            float: Result of the operation
        
        Raises:
            ValueError: If operation is invalid or inputs are invalid
            ZeroDivisionError: If division by zero occurs
        """
        if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
            raise TypeError("Operands must be numbers")
        
        if operation not in self.OPERATIONS:
            raise ValueError(f"Invalid operation: {operation}. Use get_operations() to see available operations.")
        
        result = self.OPERATIONS[operation](a, b)
        self.history.append({'a': a, 'b': b, 'operation': operation, 'result': result})
        return result
    
    def get_operations(self):
        """Return a list of all available operations."""
        return sorted(self.OPERATIONS.keys())
    
    def get_history(self, limit=None):
        """
        Retrieve calculation history.
        
        Args:
            limit (int): Maximum number of recent calculations to return
        
        Returns:
            list: History of calculations
        """
        if limit:
            return self.history[-limit:]
        return self.history
    
    def clear_history(self):
        """Clear the calculation history."""
        self.history = []
    
    def display_history(self):
        """Display formatted calculation history."""
        if not self.history:
            print("No calculation history available.")
            return
        
        print("\n--- Calculation History ---")
        for i, calc in enumerate(self.history, 1):
            op = calc['operation']
            a, b, result = calc['a'], calc['b'], calc['result']
            # Format differently for unary operations
            if op in ['sqrt', 'log', 'log10', 'abs', 'sin', 'cos', 'tan']:
                print(f"{i}. {op}({a}) = {result:.10g}")
            else:
                print(f"{i}. {a} {op} {b} = {result:.10g}")
        print()


def calculator(a, b, operation):
    """
    Simplified calculator function for backward compatibility.
    
    Args:
        a (float): First operand
        b (float): Second operand
        operation (str): Operation to perform
    
    Returns:
        float: Result of the operation
    """
    calc = Calculator()
    return calc.calculate(a, b, operation)


if __name__ == "__main__":
    # Example usage with the enhanced Calculator class
    calc = Calculator()
    
    print("=== Enhanced Calculator Demo ===\n")
    
    # Basic arithmetic operations
    print("Basic Operations:")
    print(f"10 + 5 = {calc.calculate(10, 5, '+')}")
    print(f"10 - 5 = {calc.calculate(10, 5, '-')}")
    print(f"10 * 5 = {calc.calculate(10, 5, '*')}")
    print(f"10 / 5 = {calc.calculate(10, 5, '/')}")
    print(f"10 % 3 = {calc.calculate(10, 3, '%')}")
    print(f"2 ** 3 = {calc.calculate(2, 3, '**')}")
    
    # Advanced operations
    print("\nAdvanced Operations:")
    print(f"sqrt(16) = {calc.calculate(16, 0, 'sqrt')}")
    print(f"log(100) = {calc.calculate(100, 0, 'log')}")
    print(f"abs(-7) = {calc.calculate(-7, 0, 'abs')}")
    print(f"sin(π/2) ≈ {calc.calculate(math.pi/2, 0, 'sin'):.4f}")
    print(f"max(15, 8) = {calc.calculate(15, 8, 'max')}")
    print(f"min(15, 8) = {calc.calculate(15, 8, 'min')}")
    
    # Display history
    print(f"\nTotal calculations performed: {len(calc.get_history())}")
    calc.display_history()
    
    # Show available operations
    print(f"Available operations: {', '.join(calc.get_operations())}")
