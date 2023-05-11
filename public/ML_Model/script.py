import pickle
import json
import joblib
import sys
import os

# Get the current working directory
cwd = os.getcwd()

# Set the new path to the file
new_path = os.path.join(cwd, 'public', 'ML_Model', 'model.pkl')
second_path = os.path.join(cwd, 'public', 'ML_Model', 'model.joblib')


with open(new_path, 'rb') as f:
    model = pickle.load(f)
joblib.dump(model,second_path)

model = joblib.load(second_path)
age= int(sys.argv[1])
sex = int(sys.argv[2])
bmi = float(sys.argv[3])
children = int(sys.argv[4])
smoker = int(sys.argv[5])
region = int(sys.argv[6])


def predict(input):
    nouvel_exemple = input
    prediction = model.predict([nouvel_exemple])
    model_json = json.dumps(prediction.tolist())
    print(model_json)
    return model_json
    
predict([age, sex, bmi, children, smoker, region])