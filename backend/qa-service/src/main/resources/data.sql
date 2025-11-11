INSERT INTO question (id, topic, difficulty, question_text, sample_answer) VALUES
(1, 'Java', 'Intermediate',
 'Explain the difference between HashMap and Hashtable.',
 'HashMap is non-synchronized, allows null keys/values; Hashtable is synchronized, thread-safe, and disallows nulls.'),

(2, 'Java', 'Intermediate',
 'What is the role of the JVM in Java execution?',
 'JVM converts bytecode into machine code and handles memory management, garbage collection, and runtime security.'),

(3, 'Java', 'Beginner',
 'What is polymorphism in Java?',
 'Polymorphism allows one interface or method to take multiple forms, commonly through method overriding and overloading.'),

(4, 'Spring Boot', 'Intermediate',
 'How does dependency injection work in Spring Boot?',
 'Spring Boot automatically provides beans via the IoC container and injects dependencies using annotations like @Autowired.'),

(5, 'Java', 'Advanced',
 'Explain how garbage collection works in the JVM.',
 'GC reclaims memory by removing unreachable objects; different algorithms like mark-sweep and G1 manage heap cleanup.');
