#!/bin/bash

echo "Starting Bakery Shop CTF Challenge..."
echo "======================================="
echo ""
echo "Installing dependencies..."
pip3 install flask

echo ""
echo "Starting server on http://localhost:5000"
echo "Press Ctrl+C to stop"
echo ""

python3 app.py
