# TruthAI - Fake News Detection System

TruthAI is a modern, AI-powered SaaS web application designed to detect fake news using Natural Language Processing (NLP) and Machine Learning (Logistic Regression with TF-IDF vectorization).

## Features
- **Real-time Fake News Detection**: Paste an article and instantly get a prediction.
- **AI Explanation**: Understand *why* the model made its prediction.
- **Suspicious Word Highlighting**: Visually identifies clickbait or sensational terms.
- **Confidence Scoring & Probability Charts**: Visual breakdown of the model's certainty.
- **Prediction History**: Automatically saves predictions to a local SQLite database.
- **Admin Dashboard**: View overall prediction statistics and trends.
- **Downloadable PDF Reports**: Export analysis results.
- **Modern UI/UX**: Premium aesthetic with glassmorphism, Dark/Light mode, animations (AOS), and responsive design.

## Tech Stack
- **Backend**: Python, Flask, SQLite
- **Machine Learning**: Scikit-learn, Pandas, NLTK (TF-IDF, Logistic Regression)
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript, Chart.js

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure you have Python 3.8+ installed on your system.

### 2. Clone/Navigate to the directory
```bash
cd Fake-News-Detection
```

### 3. Set up a Virtual Environment
**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```
**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Generate Dataset & Train Model
Before running the app, you need to generate the dummy dataset and train the machine learning model.
```bash
# Generate the sample dataset
python create_dummy_dataset.py

# Train the model and save the .pkl files
python model/train_model.py
```

### 6. Run the Application
```bash
python app.py
```
The application will be accessible at `http://127.0.0.1:5000/`.

---

## 🌍 Deployment Ready (Render / Railway)

To deploy this application to cloud platforms like Render or Railway:
1. Ensure your code is pushed to a GitHub repository.
2. Link the repository to your Render/Railway account.
3. Use the following build and start commands:
   - **Build Command**: `pip install -r requirements.txt && python model/train_model.py`
   - **Start Command**: `gunicorn app:app` (You may need to add `gunicorn` to `requirements.txt`).
4. Set environment variables if needed (e.g., `PORT=5000`).

## Notes
- The database `history.db` is created automatically on the first run.
- NLTK stopwords are downloaded automatically within `app.py` and `train_model.py`.
