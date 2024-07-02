import time
from flask import Flask
from flask_socketio import SocketIO, emit
import MetaTrader5 as mt5
from datetime import datetime

# Initialize Flask app and SocketIO
app = Flask(__name__)
app.config["SECRET_KEY"] = "secret_key"
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize MetaTrader 5 and login
mt5.initialize()
account = ''  # Replace with your MT5 account number
password = ''  # Replace with your MT5 account password
server = ''  # Replace with your MT5 broker server

login_status = mt5.login(account, password=password, server=server)

if login_status:
    print("Connected to MT5 account")
else:
    print("Failed to connect to MT5 account")

# Define symbols to monitor
currency_pairs = [
    "XAUUSD.ecn",
    "XAUEUR.ecn",
    "AUDUSD.ecn",
    "EURUSD.ecn",
    "GBPUSD.ecn",
    "USDCAD.ecn",
    "USDCHF.ecn",
    "USDJPY.ecn",
    "AUDJPY.ecn",
    "AUDNZD.ecn",
]

# Create a dictionary to store symbol data
currency_dict = {pair: {'bid': 0, 'ask': 0, 'current': [], 'curr_time':[]} for pair in currency_pairs}

# Function to get current time in HH:MM:SS format
def get_current_time():
    now = datetime.now()
    current_time = now.strftime("%H:%M:%S")
    return current_time

# Event handler when a client connects to the socket
@socketio.on("connect")
def connect():
    print("Client connected")

# Event handler when a client disconnects from the socket
@socketio.on("disconnect")
def disconnect():
    print("Client disconnected")

# Function to fetch and update symbol data
def get_symbol_data():
    global currency_dict

    # Iterate through each symbol in currency_dict
    for symbol in currency_dict:
        symbols = mt5.symbol_info(symbol)
        # Update bid and ask prices for the symbol
        currency_dict[symbol]['bid'] = mt5.symbol_info_tick(symbols.name).bid
        currency_dict[symbol]['ask'] = mt5.symbol_info_tick(symbols.name).ask
        # Maintain a rolling list of 40 bid prices and corresponding times
        if len(currency_dict[symbol]['current']) <= 40:
            currency_dict[symbol]['current'].append(mt5.symbol_info_tick(symbols.name).bid)
            currency_dict[symbol]['curr_time'].append(get_current_time())
        else:
            currency_dict[symbol]['current'] = currency_dict[symbol]['current'][1:]
            currency_dict[symbol]['curr_time'] = currency_dict[symbol]['curr_time'][1:]

    return currency_dict

# Event handler to fetch historical trades and emit them to the client
@socketio.on('get_historical_trades')
def get_historical_trades():
    from_date = datetime(2022, 1, 1)
    to_date = datetime.now()
    trades = mt5.history_deals_get(from_date, to_date)
    historical_trades = [trade._asdict() for trade in trades] if trades else []
    emit('historical_trades', historical_trades)

# Event handler to fetch account information and open positions, then emit to the client
@socketio.on('get_account_info')
def handle_get_account_info():
    account_info = mt5.account_info()._asdict()
    positions = mt5.positions_get()
    open_positions = [pos._asdict() for pos in positions] if positions else []
    emit('account_info', {'account_info': account_info, 'open_positions': open_positions})

# Continuous function to emit symbol data to clients
def emit_symbol_data():
    while True:
        symbol_data = get_symbol_data()
        socketio.emit("symbol_data", symbol_data)
        time.sleep(1)  # Adjust interval as needed

# Entry point of the script
if __name__ == "__main__":
    # Start emitting symbol data in a separate thread
    socketio.start_background_task(emit_symbol_data)
    # Run the Flask application with SocketIO on port 6004
    socketio.run(app, port=6004)
