import sys
from handler import handle

stdin_input = sys.stdin.read()

result = handle(stdin_input)

print(result)