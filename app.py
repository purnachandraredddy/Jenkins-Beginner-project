#!/usr/bin/env python3
"""
SimpleLife App - Flask server for serving the productivity app
"""

from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Serve static files
@app.route('/')
def index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    """Serve CSS, JS, and other static files"""
    return send_from_directory('.', filename)

@app.route('/health')
def health():
    """Health check endpoint"""
    return {'status': 'healthy', 'app': 'SimpleLife'}

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
