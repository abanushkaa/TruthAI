import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_curve, auc
import joblib
import os

# Download NLTK data
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Define preprocessing function
port_stem = PorterStemmer()

def stemming(content):
    # Remove HTML, URLs, Punctuation, Numbers (keep only alphabets)
    content = re.sub('<.*?>', '', content)
    content = re.sub(r'http\S+', '', content)
    stemmed_content = re.sub('[^a-zA-Z]', ' ', content)
    stemmed_content = stemmed_content.lower()
    stemmed_content = stemmed_content.split()
    
    stemmed_content = [port_stem.stem(word) for word in stemmed_content if not word in stopwords.words('english')]
    stemmed_content = ' '.join(stemmed_content)
    return stemmed_content

def train():
    print("Loading dataset...")
    # Load dataset
    df = pd.read_csv('../dataset/news.csv')
    
    # Preprocess text
    print("Preprocessing text data...")
    df['clean_text'] = df['text'].apply(stemming)
    
    # Define features and labels
    X = df['clean_text'].values
    # Encode labels: Real -> 0, Fake -> 1
    y = df['label'].apply(lambda x: 1 if x == 'Fake' else 0).values
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
    
    # TF-IDF Vectorization
    print("Vectorizing data...")
    vectorizer = TfidfVectorizer(max_features=5000)
    vectorizer.fit(X_train)
    X_train_vectorized = vectorizer.transform(X_train)
    X_test_vectorized = vectorizer.transform(X_test)
    
    # Train Logistic Regression Model
    print("Training Logistic Regression model...")
    model = LogisticRegression()
    model.fit(X_train_vectorized, y_train)
    
    # Evaluation
    print("Evaluating model...")
    predictions = model.predict(X_test_vectorized)
    
    acc = accuracy_score(y_test, predictions)
    prec = precision_score(y_test, predictions)
    rec = recall_score(y_test, predictions)
    f1 = f1_score(y_test, predictions)
    cm = confusion_matrix(y_test, predictions)
    
    print(f"Accuracy: {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall: {rec:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print(f"Confusion Matrix:\n{cm}")
    
    # Save the model and vectorizer
    print("Saving model and vectorizer...")
    joblib.dump(model, 'model.pkl')
    joblib.dump(vectorizer, 'vectorizer.pkl')
    
    print("Training complete! model.pkl and vectorizer.pkl have been saved in model/ directory.")

if __name__ == '__main__':
    # Ensure working directory is the model directory to save files there
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    train()
