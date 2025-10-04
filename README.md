# Vintage RPN Calculator

A web-based Reverse Polish Notation (RPN) calculator inspired by the legendary HP-67 calculator.

![Calculator Screenshot](https://github.com/user-attachments/assets/f82ac9a9-c8de-4505-9ff2-57240979aa3c)

## Features

### RPN Stack Operation
- **4-level stack** (T, Z, Y, X registers) for efficient chain calculations
- **ENTER** key to push values onto the stack
- Stack manipulation functions: **SWAP** (x⇄y), **ROLL** (R↓), **DUP**, **DROP**
- **LAST x** to recall the last X register value

### Scientific Functions
- **Trigonometric**: SIN, COS, TAN, ASIN, ACOS, ATAN
- **Logarithmic**: LN (natural log), LOG (base-10), e^x
- **Power functions**: x², √x, y^x, 1/x
- **Other math**: |x| (absolute value), INT, FRAC, π, %, x! (factorial)

### Coordinate Conversion
- **→P** (rectangular to polar): converts (x, y) to (r, θ)
- **→R** (polar to rectangular): converts (r, θ) to (x, y)
- **→H.MS**: converts decimal hours to H.MS format

### Memory & Statistics
- **STO/RCL**: Store and recall values from memory
- **Σ+**: Add data points for statistical calculations
- **x̄** (mean): Calculate average of stored data points
- **s** (standard deviation): Calculate sample standard deviation
- **L.R.**: Linear regression (returns slope and intercept)

### Entry & Editing
- Standard numeric entry with decimal point
- **CHS**: Change sign (negate current value)
- **EEX**: Enter scientific notation exponent
- **DEL**: Delete current entry
- **CLR**: Clear all stack registers

### Input Methods
- **Mouse/Touch**: Click buttons to operate
- **Keyboard shortcuts**:
  - Numbers 0-9 and decimal point
  - Enter key for ENTER
  - Backspace for DEL
  - Escape for CLR

## How to Use

### Basic Arithmetic Example
To calculate 5 + 3:
1. Enter `5`
2. Press `ENTER`
3. Enter `3`
4. Press `+`
5. Result: `8`

### Using the Stack
The RPN stack allows you to work with multiple values efficiently:
- **X register**: Current/display value
- **Y register**: Second value for operations
- **Z register**: Third stack level
- **T register**: Top of stack (automatically duplicates when needed)

## Technical Details

- Pure HTML5, CSS3, and vanilla JavaScript
- No external dependencies or frameworks
- Responsive design works on desktop and mobile

## Running the Calculator

Simply open `index.html` in any modern web browser.

## License

Unrestricted public domain - feel free to use and modify!
