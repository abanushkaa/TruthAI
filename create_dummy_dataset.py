import pandas as pd
import random

# Create a small synthetic dataset for Fake News Detection
data = {
    'text': [
        'Breaking: The government is hiding a secret 100% cure for all diseases discovered by a miracle doctor! Click here to see the exclusive report.',
        'Shocking revelation! Aliens have landed and the government is hiding them from the public. This is the truth they don\'t want you to know!',
        'A secret conspiracy to control the world economy has been uncovered by anonymous sources. Read this exclusive before it gets deleted.',
        'Miracle weight loss pill discovered! Lose 50 pounds in one week with no exercise. Doctors hate this one simple trick! Click here.',
        'The Federal Reserve announced a new monetary policy to adjust interest rates in an effort to combat rising inflation and stabilize the economy.',
        'Local elections saw a record voter turnout yesterday. The newly elected mayor promised to focus on infrastructure and public education.',
        'Scientists at the National University have published a new study on climate change, detailing the long-term effects of greenhouse gases on polar ice caps.',
        'A new technology startup raised $50 million in Series B funding to develop AI-driven logistics software for supply chain management.'
    ],
    'label': [
        'Fake', 'Fake', 'Fake', 'Fake',
        'Real', 'Real', 'Real', 'Real'
    ]
}

# Duplicate data to increase dataset size slightly for training
df = pd.DataFrame(data)
df = pd.concat([df]*20, ignore_index=True)

# Add some random noise
df = df.sample(frac=1).reset_index(drop=True)

df.to_csv('dataset/news.csv', index=False)
print("Dummy dataset created at dataset/news.csv")
