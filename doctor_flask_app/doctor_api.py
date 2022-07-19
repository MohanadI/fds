# Dependencies
from flask import Flask, request, jsonify
import joblib
import traceback
import pandas as pd
import numpy as np

# Your API definition
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    if lr:
        try:
            json_ = request.json
            # print(json_)
            entry = pd.DataFrame(json_)
            # print(entry)
            # print(entry['ThrCodeMax'])
            ob = {}
            ob["ScaledThrCodeMax"] = scalerThrCodeMax.transform(entry[['ThrCodeMax']])[0][0]
            ob["ScaledAvgnumber_of_act"] = scalerAvgnumber_of_act.transform(entry[['Avgnumber_of_act']])[0][0]
            ob["ScaledAvgSumClaim"] = scalerAvgSumClaim.transform(entry[['avgSumClaim']])[0][0]
            ob["ScaledMax_Doctor_visit_peryear"] = scalerMax_Doctor_visit_peryear.transform(entry[['max_Doctor_visit_peryear']])[0][0]
            ob["ScaledMedAvg"] = scalerMedAvg.transform(entry[['medAvg']])[0][0]
            ob["ScaledAvgSubscriberDoctorCost"] = scalerAvgSubscriberDoctorCost.transform(entry[['avgSubscriberDoctorCost']])[0][0]
            print(ob)
            json_ = [ob]
            query = pd.get_dummies(pd.DataFrame(json_))
            query = query.reindex(columns=model_columns, fill_value=0)

            prediction = lr.predict(query)[0]

            return jsonify({'cluster': str(prediction)})

        except:

            return jsonify({'trace': traceback.format_exc()})
    else:
        print ('Train the model first')
        return ('No model here to use')

if __name__ == '__main__':
    try:
        port = int(sys.argv[1]) # This is for a command-line input
    except:
        port = 9002 # If you don't provide any port the port will be set to 12345

    lr = joblib.load("doctor_km_8_model.pkl") # Load "model.pkl"
    scalerThrCodeMax = joblib.load("scalerThrCodeMax.pkl")
    scalerAvgnumber_of_act = joblib.load("scalerAvgnumber_of_act.pkl")
    scalerAvgSumClaim = joblib.load("scalerAvgSumClaim.pkl")
    scalerMax_Doctor_visit_peryear = joblib.load("scalerMax_Doctor_visit_peryear.pkl")
    scalerMedAvg = joblib.load("scalerMedAvg.pkl")
    scalerAvgSubscriberDoctorCost = joblib.load("scalerAvgSubscriberDoctorCost.pkl")
    print ('Model loaded')
    model_columns = joblib.load("doctor_model_columns.pkl") # Load "model_columns.pkl"
    print ('Model columns loaded')

    app.run(port=port, debug=True)