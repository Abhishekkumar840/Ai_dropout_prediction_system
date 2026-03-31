import sys
import pandas as pd
import json
import pickle
import numpy as np
import os
from pathlib import Path

def load_model():
    """Load the trained XGBoost model"""
    try:
        current_dir = Path(__file__).parent
        model_path = current_dir / 'final_xgboost_dropout_model.pkl'
        
        with open(model_path, 'rb') as file:
            model = pickle.load(file)
        return model
    except Exception as e:
        print(f"Error loading model: {e}", file=sys.stderr)
        return None

def preprocess_data(df):
    """Preprocess data for ML model prediction"""
    try:
        # Create feature columns (adjust based on your model's training features)
        features = df.copy()
        
        # Convert percentage strings to float if needed
        if 'Attendance %' in features.columns:
            features['Attendance %'] = pd.to_numeric(features['Attendance %'], errors='coerce')
        if 'Grade %' in features.columns:
            features['Grade %'] = pd.to_numeric(features['Grade %'], errors='coerce')
            
        # Handle categorical variables (if your model was trained with encoded categories)
        if 'Gender' in features.columns:
            features['Gender_Male'] = (features['Gender'] == 'Male').astype(int)
            features['Gender_Female'] = (features['Gender'] == 'Female').astype(int)
            
        if 'College Type' in features.columns:
            features['College_Type_Government'] = (features['College Type'] == 'Government').astype(int)
            features['College_Type_Private'] = (features['College Type'] == 'Private').astype(int)
            
        # Select features that your model expects (adjust column names based on your training)
        expected_features = [
            'Age', 'Attendance %', 'Grade %', 'Backlogs', 'Fees Due',
            'Gender_Male', 'Gender_Female', 
            'College_Type_Government', 'College_Type_Private'
        ]
        
        # Keep only available features
        available_features = [col for col in expected_features if col in features.columns]
        model_input = features[available_features]
        
        # Fill NaN values
        model_input = model_input.fillna(0)
        
        return model_input
        
    except Exception as e:
        print(f"Error preprocessing data: {e}", file=sys.stderr)
        return None

def predict_risk_level(probabilities):
    """Convert model probabilities to risk levels"""
    # Assuming your model outputs dropout probability (0-1)
    if isinstance(probabilities, (list, np.ndarray)):
        prob = probabilities[0] if len(probabilities) > 0 else 0
    else:
        prob = probabilities
        
    if prob >= 0.7:
        return 'High'
    elif prob >= 0.4:
        return 'Medium'
    else:
        return 'Low'

def main():
    try:
        # Load trained model
        model = load_model()
        if model is None:
            raise Exception("Could not load ML model")
            
        # Read input data
        file_path = sys.argv[1]
        data = pd.read_csv(file_path)
        
        # Preprocess data for model
        processed_data = preprocess_data(data)
        if processed_data is None:
            raise Exception("Data preprocessing failed")
            
        # Make predictions using trained XGBoost model
        try:
            predictions = model.predict_proba(processed_data)
            # If binary classification, take probability of dropout (class 1)
            dropout_probabilities = predictions[:, 1] if predictions.shape[1] > 1 else predictions
        except Exception as e:
            # Fallback to predict method if predict_proba fails
            predictions = model.predict(processed_data)
            dropout_probabilities = predictions
            
        # Create response with ML predictions
        students = []
        for i, (_, row) in enumerate(data.iterrows()):
            prob = dropout_probabilities[i] if i < len(dropout_probabilities) else 0
            predicted_risk = predict_risk_level(prob)
            
            student = {
                'id': str(row.get('Roll No', row.get('Registration No', ''))),
                'name': str(row.get('Name', '')),
                'attendance': str(row.get('Attendance %', '')),
                'score': str(row.get('Grade %', '')),
                'risk': predicted_risk,
                'dropout_probability': float(prob),  # Add ML confidence
                'ml_prediction': True
            }
            students.append(student)
            
        result = {
            "message": f"✅ XGBoost ML model prediction completed! {len(students)} students analyzed.",
            "students": students,
            "model_info": {
                "type": "XGBoost Classifier",
                "model_file": "final_xgboost_dropout_model.pkl",
                "features_used": list(processed_data.columns) if processed_data is not None else []
            }
        }
        
        print(json.dumps(result))
        
    except Exception as e:
        # Fallback to rule-based prediction if ML fails
        fallback_result = {
            "error": f"ML model failed: {str(e)}",
            "message": "Using fallback rule-based prediction",
            "students": [],
            "ml_fallback": True
        }
        print(json.dumps(fallback_result))

if __name__ == "__main__":
    main()