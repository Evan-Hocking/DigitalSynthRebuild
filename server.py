from flask import Flask, jsonify, send_from_directory, render_template, make_response
import os
import json
import webbrowser


app = Flask(__name__)

# Serve index.html from the 'templates' folder
@app.route('/')
def index():
    return render_template('index.html')


def get_module_paths(directory):
    module_paths = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.mjs'):
                module_paths.append(os.path.join(root, file))
    return module_paths

@app.route('/get_module_paths')
def get_module_paths_route():
    directory_path = './static/js/modules'
    module_paths = get_module_paths(directory_path)
    module_paths = [path.replace('./static/js', '') for path in module_paths]
    return jsonify(module_paths)



# @app.route('/')
# def index():
#     # Path to the modules directory
#     modules_dir = os.path.join(app.static_folder, 'js/modules')
#     # Recursively find all .mjs files
#     script_files = []
#     for root, dirs, files in os.walk(modules_dir):
#         for file in files:
#             if file.endswith('.mjs'):
#                 # Create a relative path for the script
#                 relative_path = os.path.relpath(os.path.join(root, file), app.static_folder)
#                 script_files.append(relative_path)
#     return render_template('index.html', script_files=script_files)

# Serve static files from the 'static' folder
@app.route('/static/<path:filename>')
def serve_static(filename):
    response = make_response(send_from_directory('static', filename))
    if filename.endswith('.mjs'):
        response.headers['Content-Type'] = 'application/javascript; charset=utf-8; module'
    return response

@app.route('/static/js/modules/<path:filepath>')
def serve_static_modules(filepath):
    print(filepath)
    response = make_response(send_from_directory('static/js/modules', filepath))
    if filepath.endswith('.mjs'):
        response.headers['Content-Type'] = 'application/javascript; charset=utf-8; module'
    return response

'''
# API endpoint to get the list of files
@app.route('/get_files')
def get_files():
    folder_path = './static/js/filters'
    files = os.listdir(folder_path)
    print(files)
    return jsonify(files)
    '''
'''
@app.route('/get_config')
def get_config():
    path = "./config.json"
    with open(path, 'r') as file:
        data = json.load(file)
        return data
'''

if __name__ == '__main__':
    webbrowser.open("http://127.0.0.1:5000/")
    app.run(port=5000)
    
