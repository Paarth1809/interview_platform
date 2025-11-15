import nltk
from nltk import pos_tag, word_tokenize
from collections import Counter

nltk.download("punkt", quiet=True)
nltk.download("averaged_perceptron_tagger", quiet=True)

def extract_keywords(text: str, top_k=10):
    tokens = word_tokenize(text)
    tagged = pos_tag(tokens)
    nouns = [w for w, t in tagged if t.startswith("NN")]
    freq = Counter(nouns)
    return [w for w, _ in freq.most_common(top_k)]

def keyword_coverage(keywords, response):
    count = sum(1 for k in keywords if k in response.split())
    return count / len(keywords) if keywords else 0
