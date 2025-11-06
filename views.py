from flask import Blueprint, render_template, request, send_file, jsonify, redirect
from Generator.QR_Generator import *
from Generator.Short_URL_Generator import *
import os, io, sqlite3

views = Blueprint(__name__, "views")

# --- Database setup ---
def init_db():
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            short_id TEXT UNIQUE,
            original_url TEXT
        )
    ''')
    conn.commit()
    conn.close()
# Initialize
init_db()

# Routing
@views.route("/")
def home():
    return render_template("index.html")

@views.route("/generate-shorten", methods=['GET', 'POST'])
def generate_shorten():
    # Get Shorten Value
    data_shorten = request.form['data-shorten']
    # Shorten it
    short_id = generate_short_url()
    # Add to Database
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT short_id FROM urls WHERE original_url = ?", (data_shorten,))
    row = c.fetchone()

    if row:
        # Already exists
        print("URL already shortened with ID:", row[0])
        # Return Value
        short_url = f"http://localhost:5000/{row[0]}"
        return jsonify({'short_url': short_url})
    else:
        # Insert new
        c.execute("INSERT INTO urls (short_id, original_url) VALUES (?, ?)", (short_id, data_shorten))
        conn.commit()
        # Return Value
        short_url = f"http://localhost:5000/{short_id}"
        return jsonify({'short_url': short_url})

@views.route("/generate-qr", methods=['GET', 'POST'])
def generate_qr():
    # Get QR Value    
    data_qr = request.args.get("data_qr")
    if not data_qr:
        return "Missing data", 400
    # Return and Generate QR
    return send_file(
        qr_generator(data_qr),
        mimetype = 'image/png',
        as_attachment = False,  # change to True if you want it to download instead of display
        download_name = 'qrcode.png'
    )

@views.route('/<short_id>')
def redirect_to_original(short_id):
    conn = sqlite3.connect('database.db')
    c = conn.cursor()
    c.execute("SELECT original_url FROM urls WHERE short_id = ?", (short_id,))
    result = c.fetchone()
    conn.close()

    if result:
        return redirect(result[0])
    return "URL not found", 404