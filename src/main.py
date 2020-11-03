from flask import Flask, render_template
from api.api import api

app = Flask(__name__, template_folder='templates')
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def home():
    return render_template("main.html")

@app.route('/editor')
def editor():
    return render_template('editor.html')


app.run(debug=True)