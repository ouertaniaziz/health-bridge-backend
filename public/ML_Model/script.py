import pickle
import json
import joblib
import sys

with open('C:\\Users\\21626\\OneDrive\\Documents\\4twins2\\PI\\health-bridge-backend\\public\\ML_Model\\model.pkl', 'rb') as f:
    model = pickle.load(f)
joblib.dump(model, 'C:\\Users\\21626\\OneDrive\\Documents\\4twins2\\PI\\health-bridge-backend\\public\\ML_Model\\model.joblib')

model = joblib.load('C:\\Users\\21626\\OneDrive\\Documents\\4twins2\\PI\\health-bridge-backend\\public\\ML_Model\\model.joblib')
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