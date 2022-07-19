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
            ob["ScaledAGE"] = scalerAGE.transform(entry[['AGE']])[0][0]
            ob["ScaledCITY"] =scalerCITY.transform(entry[['CITY']])[0][0]
            ob["ScaledMaxSUBVisitsSameDoctor"] =scalermaxSUBVisitsSameDoctor.transform(entry[['maxSUBVisitsSameDoctor']])[0][0]
            ob["ScaledNumber_of_visit_per_year"] =scalernumber_of_visit_per_year.transform(entry[['number_of_visit_per_year']])[0][0]
            ob["ScaledAvgnumber_of_act"] =scalerAvgnumber_of_act.transform(entry[['Avgnumber_of_act']])[0][0]
            ob["ScaledAvgSumClaimPerYear"] =scaleravgSumClaimPerYear.transform(entry[['avgSumClaimPerYear']])[0][0]
            ob["ScaledAvgSumClaimPerVisit"] =scaleravgSumClaimPerVisit.transform(entry[['avgSumClaimPerVisit']])[0][0]
            ob["ScaledAvgTimeDiff"] = scaleravgTimeDiff.transform(entry[['avgTimeDiff']])[0][0]
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
        port = 9001 # If you don't provide any port the port will be set to 12345

    lr = joblib.load("patient_km_8_model.pkl") # Load "model.pkl"
    scalerThrCodeMax = joblib.load("scalerThrCodeMax.pkl")
    scalerAGE = joblib.load("scalerAGE.pkl")
    scalerCITY = joblib.load("scalerCITY.pkl")
    scalermaxSUBVisitsSameDoctor = joblib.load("scalermaxSUBVisitsSameDoctor.pkl")
    scalernumber_of_visit_per_year = joblib.load("scalernumber_of_visit_per_year.pkl")
    scalerAvgnumber_of_act = joblib.load("scalerAvgnumber_of_act.pkl")
    scaleravgSumClaimPerYear = joblib.load("scaleravgSumClaimPerYear.pkl")
    scaleravgSumClaimPerVisit = joblib.load("scaleravgSumClaimPerVisit.pkl")
    scaleravgTimeDiff = joblib.load("scaleravgTimeDiff.pkl")
    print ('Model loaded')
    model_columns = joblib.load("patient_model_columns.pkl") # Load "model_columns.pkl"
    print ('Model columns loaded')

    app.run(port=port, debug=True)