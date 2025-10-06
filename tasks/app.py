
from flask import Flask, request, g
import sqlite3, html
DB='bakery.db'
app=Flask(__name__)

def get_db():
    db = getattr(g,'db',None)
    if db is None:
        db = g.db = sqlite3.connect(DB)
    return db

@app.route('/')
def index():
    return "<h3>Welcome to the Bakery search</h3>Use /search?q=... to search pastries."

@app.route('/search')
def search():
    q = request.args.get('q','')
    db=get_db()
    # intentionally vulnerable: string concat into SQL with LIKE
    sql = "SELECT name, description FROM pastries WHERE name LIKE '%"+q+"%';"
    try:
        cur = db.execute(sql)
        rows = cur.fetchall()
        out = '<ul>'
        for r in rows:
            out += '<li><b>'+html.escape(r[0])+'</b>: '+html.escape(r[1])+'</li>'
        out += '</ul>'
        return out
    except Exception as e:
        return "Error: "+str(e)

if __name__=='__main__':
    app.run(host='0.0.0.0',port=5000)
