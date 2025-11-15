def generate_feedback(similarity, coverage):
    fb = []
    
    if similarity < 0.70:
        fb.append("Your answer needs stronger alignment with the expected meaning.")

    if coverage < 0.5:
        fb.append("You missed several important concepts. Include more keywords.")

    if not fb:
        fb.append("Good answer. You covered the main ideas.")

    return fb
